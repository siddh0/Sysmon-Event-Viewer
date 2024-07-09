import React, { useState } from 'react';
import { Table } from 'antd';
import { ConfigProvider, theme, Button, Card } from "antd";

const EventData = ({ data }) => (
  <div>
    <h3 className="text-lg font-semibold">Event Data</h3>
    <ul className="list-disc ml-5">
      {data.map((item, index) => (
        <li key={index} className="my-1">
          <strong>{item._attributes.Name}:</strong> {item._text}
        </li>
      ))}
    </ul>
  </div>
);

const LogViewer = ({ logContent }) => {
  const { darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedEventIndex, setExpandedEventIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedEventIndex(expandedEventIndex === index ? null : index);
  };

  if (!logContent) {
    return <div className="text-center text-gray-500">No content to display</div>;
  }

  const columns = [
    {
      title: 'EventID',
      dataIndex: 'EventID',
      key: 'EventID',
      render: (text, record) => (
        <div className="cursor-pointer text-green-500" onClick={() => handleToggle(record.key)}>
          {text}
        </div>
      ),
    },
    {
      title: 'TimeCreated',
      dataIndex: 'TimeCreated',
      key: 'TimeCreated',
    },
    {
      title: 'Image',
      dataIndex: 'Image',
      key: 'Image',
    },
  ];

  const dataSource = logContent.Events.Event.map((event, index) => ({
    key: index,
    EventID: event.System.EventID._text,
    TimeCreated: event.System.TimeCreated._attributes.SystemTime,
    Image: event.EventData.Data.find((d) => d._attributes.Name === 'Image')?._text || 'N/A',
    expandedDetails: (
      <div>
        <div><strong>Level:</strong> {event.System.Level._text}</div>
        <div><strong>Task:</strong> {event.System.Task._text}</div>
        <div><strong>Opcode:</strong> {event.System.Opcode._text}</div>
        <div><strong>Channel:</strong> {event.System.Channel._text}</div>
        <div><strong>Computer:</strong> {event.System.Computer._text}</div>
        <EventData data={event.EventData.Data} />
      </div>
    ),
  }));

  return (

    <ConfigProvider
   theme={{
    algorithm: darkAlgorithm 
   }}>
    <div>
      <Table
        
        columns={columns}
        dataSource={dataSource}
        expandedRowRender={(record) => record.expandedDetails}
        expandRowByClick
      />

    </div>
    </ConfigProvider>
  );
};

export default LogViewer;