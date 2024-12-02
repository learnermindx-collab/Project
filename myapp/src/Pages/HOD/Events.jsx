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
} from "antd";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Content } = Layout;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [form] = Form.useForm();
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Default events
  useEffect(() => {
    const defaultEvents = [
      {
        name: "Project Kickoff ",
        date: moment().format("YYYY-MM-DD"),
        time: "10:00",
        description: "Initial meeting to discuss project goals and milestones.",
      },
      {
        name: "Proposal Review",
        date: moment().subtract(1, "days").format("YYYY-MM-DD"),
        time: "14:00",
        description: "Review Proposal progress and make necessary adjustments.",
      },
    ];
    setEvents(defaultEvents);
  }, []);

  // Handle event creation
  const handleCreateEvent = (values) => {
    const event = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
    };
    setEvents([...events, event]);
    form.resetFields();
    setCalendarVisible(false);
    message.success("Event created successfully!");
  };

  // Handle event selection to show details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDetailsVisible(true);
  };

  // Export events as PDF
  const handleExportEvents = () => {
    const doc = new jsPDF();
    const tableColumn = ["Event Name", "Date", "Time", "Description"];
    const tableRows = [];

    events.forEach((event) => {
      const eventData = [event.name, event.date, event.time, event.description];
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

  // Filter today's events and previous events
  const todayEvents = events.filter((event) => event.date === today);
  const previousEvents = events.filter((event) => event.date !== today);

  // Generate calendar events data
  const getEventData = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return events.filter((event) => event.date === formattedDate);
  };

  // Render calendar event markers
  const dateCellRender = (value) => {
    const eventList = getEventData(value);
    return (
      <ul className="events">
        {eventList.map((event) => (
          <li key={event.name}>
            <Badge color="blue" text={event.name} />
          </li>
        ))}
      </ul>
    );
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
          <h1>Events Management</h1>
        </div>

        {/* All Created Events */}
        <div style={{ marginBottom: "34px", fontSize: "25px" }}>
          <h2>All Created Events</h2>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={events}
            renderItem={(event) => (
              <List.Item>
                <Card
                  title={event.name}
                  extra={
                    <Button
                      type="primary"
                      onClick={() => handleSelectEvent(event)}
                    >
                      Detailed View
                    </Button>
                  }
                >
                  <p>
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* Today's Events */}
        <div style={{ marginBottom: "24px", fontSize: "25px" }}>
          <h2>Today Created Events</h2>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={todayEvents}
            renderItem={(event) => (
              <List.Item>
                <Card
                  title={event.name}
                  extra={
                    <Button
                      type="primary"
                      onClick={() => handleSelectEvent(event)}
                    >
                      Detailed View
                    </Button>
                  }
                >
                  <p>
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
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
            Export Events
          </Button>
        </div>

        {/* Calendar */}
        <div style={{ marginBottom: "24px", height:"1000px", width:"1000px"}}>
          <Calendar dateCellRender={dateCellRender} />
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <Modal
            title={selectedEvent.name}
            visible={detailsVisible}
            onCancel={() => setDetailsVisible(false)}
            footer={null}
          >
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedEvent.time}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
          </Modal>
        )}

        {/* Create Event Modal */}
        <Modal
          title="Create New Event"
          visible={calendarVisible}
          onCancel={() => setCalendarVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            requiredMark={false}
            layout="vertical"
            onFinish={handleCreateEvent}
          >
            <Form.Item
              name="name"
              label="Event Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="time" label="Time" rules={[{ required: true }]}>
              <TimePicker />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
