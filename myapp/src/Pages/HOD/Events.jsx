import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Card,
  List,
  Calendar,
  Modal,
  Badge,
  message,
  Select,
  Tag,
  Space,
} from "antd";
import io from "socket.io-client";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Content } = Layout;
const { Option } = Select;

// Current user's role - this would typically come from auth context
const CURRENT_ROLE = "hod";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [form] = Form.useForm();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch events from API on component mount
  useEffect(() => {
    fetchEvents();

    const socket = io("http://localhost:5000");
    const userId = localStorage.getItem('userId') || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null);
    if (userId) {
      socket.emit('join', userId);
      socket.on('notification', (notification) => {
        fetchEvents();
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter events for current role - show events where:
  // 1. Current role is in notifyRoles, OR
  // 2. Current role created the event
  const getFilteredEvents = (allEvents) => {
    return allEvents.filter(event => {
      const isNotified = event.notifyRoles && event.notifyRoles.includes(CURRENT_ROLE);
      const isCreator = event.createdBy === CURRENT_ROLE;
      return isNotified || isCreator;
    });
  };

  // Handle event creation with notification and database save
  const handleCreateEvent = async (values) => {
    const notifyRoles = values.notifyRoles ? values.notifyRoles.map(r => r.toLowerCase()) : ["hod", "supervisor", "student"];
    
    const eventData = {
      title: values.title,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      location: values.location || "TBD",
      description: values.description || "",
      notifyRoles: notifyRoles,
      createdBy: CURRENT_ROLE
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          eventTitle: eventData.title,
          eventDate: eventData.date,
          eventTime: eventData.time,
          eventLocation: eventData.location,
          eventDescription: eventData.description,
          notifyRoles: notifyRoles,
          createdBy: CURRENT_ROLE
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh events from database
        fetchEvents();
        form.resetFields();
        setCalendarVisible(false);
        message.success(`Event created successfully! ${data.count} notification(s) sent.`);
      } else {
        message.error("Failed to create event");
      }
    } catch (error) {
      console.error('Error creating event:', error);
      message.error("Failed to create event");
    }
  };

  // Handle event selection to show details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDetailsVisible(true);
  };

  const handleDeleteEvent = async (eventId) => {
    Modal.confirm({
      title: 'Delete Event',
      content: 'Are you sure you want to delete this event?',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.ok) {
            message.success('Event deleted successfully');
            fetchEvents();
          } else {
            message.error('Failed to delete event');
          }
        } catch (error) {
          console.error('Delete error:', error);
          message.error('Failed to delete event');
        }
      }
    });
  };

  // Export events as PDF (only filtered events)
  const handleExportEvents = () => {
    const doc = new jsPDF();
    const tableColumn = ["Event Title", "Date", "Time", "Location", "Description", "Notify Roles"];
    const tableRows = [];

    const filteredEvents = getFilteredEvents(events);
    filteredEvents.forEach((event) => {
      const eventData = [
        event.title, 
        event.date, 
        event.time, 
        event.location, 
        event.description,
        event.notifyRoles ? event.notifyRoles.join(", ") : "All"
      ];
      tableRows.push(eventData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Events.pdf");
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter events for HOD role
  const hodEvents = getFilteredEvents(events);
  const todayEvents = hodEvents.filter((event) => event.date === today);
  const upcomingEvents = hodEvents.filter((event) => event.date > today);

  // Generate calendar events data (filtered for current role)
  const getEventData = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return hodEvents.filter((event) => event.date === formattedDate);
  };

  // Render calendar event markers
  const dateCellRender = (value) => {
    const eventList = getEventData(value);
    return (
      <ul className="events">
        {eventList.map((event) => (
          <li key={event._id || event.title}>
            <Badge color="blue" text={event.title} />
          </li>
        ))}
      </ul>
    );
  };

  // Helper to render role tags
  const renderRoleTags = (notifyRoles) => {
    if (notifyRoles && notifyRoles.length > 0) {
      return notifyRoles.map(role => (
        <Tag key={role} color="blue">{role}</Tag>
      ));
    }
    return <Tag color="green">All</Tag>;
  };

  return (
    <Layout style={{ padding: "24px" }}>
      <Content>
        {/* Heading */}
        <div
          style={{
            marginBottom: "24px",
            backgroundColor: "#4D96FF",
            color: "white",
            textAlign: "center",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          <h1>Events Management - HOD</h1>
        </div>

        {/* All Events for HOD */}
        <div style={{ marginBottom: "34px", fontSize: "25px" }}>
          <h2>My Events (HOD)</h2>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={hodEvents}
            loading={loading}
            renderItem={(event) => (
              <List.Item>
                <Card
                  title={event.title}
                  extra={
                    <Button
                      type="primary"
                      onClick={() => handleSelectEvent(event)}
                    >
                      Detailed View
                    </Button>
                  }
                >
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Notify Roles:</strong> {renderRoleTags(event.notifyRoles)}</p>
                  <p><strong>Created By:</strong> {event.createdBy || CURRENT_ROLE}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* Today's Events */}
        <div style={{ marginBottom: "24px", fontSize: "25px" }}>
          <h2>Today's Events</h2>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={todayEvents}
            loading={loading}
            renderItem={(event) => (
              <List.Item>
                <Card
                  title={event.title}
                  extra={
                    <Button
                      type="primary"
                      onClick={() => handleSelectEvent(event)}
                    >
                      Detailed View
                    </Button>
                  }
                >
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Notify Roles:</strong> {renderRoleTags(event.notifyRoles)}</p>
                  <p><strong>Created By:</strong> {event.createdBy || CURRENT_ROLE}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* Upcoming Events */}
        <div style={{ marginBottom: "24px", fontSize: "25px" }}>
          <h2>Upcoming Events</h2>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={upcomingEvents}
            loading={loading}
            renderItem={(event) => (
              <List.Item>
                <Card
                  title={event.title}
                  extra={
                    <Button
                      type="primary"
                      onClick={() => handleSelectEvent(event)}
                    >
                      Detailed View
                    </Button>
                  }
                >
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Notify Roles:</strong> {renderRoleTags(event.notifyRoles)}</p>
                  <p><strong>Created By:</strong> {event.createdBy || CURRENT_ROLE}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* Buttons */}
        <div style={{ marginBottom: "24px" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => setCalendarVisible(true)}
            style={{ marginRight: "8px" }}
          >
            Create New Event
          </Button>
          <Button type="default" size="large" onClick={handleExportEvents}>
            Export My Events
          </Button>
        </div>

        {/* Calendar */}
        <div style={{ marginBottom: "24px", height:"1000px", width:"1000px"}}>
          <Calendar dateCellRender={dateCellRender} />
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            open={detailsVisible}
            onCancel={() => setDetailsVisible(false)}
            footer={null}
          >
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Notify Roles:</strong> {renderRoleTags(selectedEvent.notifyRoles)}</p>
            <p><strong>Created By:</strong> {selectedEvent.createdBy || CURRENT_ROLE}</p>
          </Modal>
        )}

        {/* Create Event Modal */}
        <Modal
          title="Create New Event"
          open={calendarVisible}
          onCancel={() => setCalendarVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            requiredMark={false}
            layout="vertical"
            onFinish={handleCreateEvent}
          >
            <Form.Item name="title" label="Event Title" rules={[{ required: true, message: "Please enter event title" }]}>
              <Input placeholder="Enter event title" />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select date" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="time" label="Time" rules={[{ required: true, message: "Please select time" }]}>
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Input placeholder="Enter event location" />
            </Form.Item>
            <Form.Item name="notifyRoles" label="Notify Roles" tooltip="Select which roles should be notified">
              <Select mode="multiple" placeholder="Select roles to notify" defaultValue={["hod", "supervisor", "student"]}>
                <Option value="hod">HOD</Option>
                <Option value="supervisor">Supervisor</Option>
                <Option value="student">Student</Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} placeholder="Enter event description" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create Event
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EventsPage;
