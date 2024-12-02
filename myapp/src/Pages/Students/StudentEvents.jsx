import React, { useState } from "react";
import { Card, Col, Row, Modal } from "antd";
import { CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Meta } = Card;

// Sample data for events
const events = [
  {
    id: 1,
    title: " Workshop",
    date: "2024-08-25",
    location: "Room 201, Building 1",
    description:
      "An in-depth workshop on React.js, covering hooks, state management, and component lifecycle.",
    type: "new", // Event type (new or previous)
  },
  {
    id: 2,
    title: "Mentorship Meetup",
    date: "2024-08-27",
    location: "Room 301, Building 2",
    description:
      "A meetup for mentors and mentees to discuss progress and future goals.",
    type: "new",
  },
  {
    id: 3,
    title: "Final Project Presentation",
    date: "2024-09-01",
    location: "Main Auditorium",
    description:
      "Students will present their final projects to mentors and peers.",
    type: "new",
  },
  {
    id: 4,
    title: "Introduction to AI",
    date: "2024-07-15",
    location: "Room 101, Building 3",
    description:
      "A basic introduction to AI concepts, including machine learning and neural networks.",
    type: "previous",
  },
  {
    id: 5,
    title: "Python for Data Science",
    date: "2024-07-20",
    location: "Room 102, Building 2",
    description:
      "An overview of Python libraries and tools used in data science.",
    type: "previous",
  },
];

const EventsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const showModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Filter events by type
  const newEvents = events.filter((event) => event.type === "new");
  const previousEvents = events.filter((event) => event.type === "previous");

  return (
    <div style={{ padding: "20px", marginLeft: "40px" }}>
      <div style={{ fontSize: "25px" }}>
        <h2>New Events</h2>
      </div>
      <Row gutter={[16, 16]}>
        {newEvents.map((event) => (
          <Col span={8} key={event.id}>
            <Card
              hoverable
              style={{ height: "100%" }}
              onClick={() => showModal(event)}
            >
              <Meta
                title={event.title}
                description={
                  <>
                    <div>
                      <CalendarOutlined /> {event.date}
                    </div>
                    <div>
                      <InfoCircleOutlined /> {event.location}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <h2 style={{ marginTop: "40px", fontSize: "25px" }}>Previous Events</h2>
      <Row gutter={[16, 16]}>
        {previousEvents.map((event) => (
          <Col span={8} key={event.id}>
            <Card
              hoverable
              style={{ height: "100%" }}
              onClick={() => showModal(event)}
            >
              <Meta
                title={event.title}
                description={
                  <>
                    <div>
                      <CalendarOutlined /> {event.date}
                    </div>
                    <div>
                      <InfoCircleOutlined /> {event.location}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <p>
            <strong>Date:</strong> {selectedEvent.date}
          </p>
          <p>
            <strong>Location:</strong> {selectedEvent.location}
          </p>
          <p>
            <strong>Description:</strong> {selectedEvent.description}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default EventsPage;
