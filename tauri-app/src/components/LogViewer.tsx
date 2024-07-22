import React, { useState, useRef } from 'react';
import { Table, Input, Button, Space, ConfigProvider, theme } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

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

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleToggle = (index) => {
    setExpandedEventIndex(expandedEventIndex === index ? null : index);
  };

  if (!logContent) {
    return <div className="text-center text-gray-500">No content to display</div>;
  }

  const formatISODate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return date.toLocaleString('en-US', options);
  };

  const columns = [
    {
      title: 'EventID',
      dataIndex: 'EventID',
      key: 'EventID',
      defaultSortOrder: 'descend',
      
      sorter: (a, b) => a.EventID - b.EventID,
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
      ...getColumnSearchProps('Image'), // Add search functionality to the Image column
    },
  ];

  const dataSource = logContent.Events.Event.map((event, index) => ({
    key: index,
    EventID: event.System.EventID._text,
    TimeCreated: formatISODate(event.System.TimeCreated._attributes.SystemTime),
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
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          expandedRowRender={(record) => record.expandedDetails}
          expandRowByClick
          showSorterTooltip={{
            target: 'sorter-icon',
          }}
          pagination={{
            pageSize: 100,
          }}
          scroll={{
            y: 600,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default LogViewer;
