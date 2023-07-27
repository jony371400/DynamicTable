import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [newRobot, setNewRobot] = useState({ ID: '', NAME: '' });
  const [editingRow, setEditingRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/robots');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editingRow) {
      // 編輯模式下不允許修改 ID 欄位
      if (name === 'ID') return;
      setEditingRow((prevRow) => ({
        ...prevRow,
        [name]: value,
      }));
    } else {
      setNewRobot((prevRobot) => ({
        ...prevRobot,
        [name]: value,
      }));
    }
  };

  const handleAddRobot = () => {
    setNewRobot({ ID: '', NAME: '' }); // 清空輸入框
    setOpenDialog(true);
  };

  const handleEditRow = (row) => {
    setEditingRow(row);
    setOpenDialog(true);
  };

  const handleUpdateRow = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/robots/${editingRow.ID}`, {
        // 編輯模式下，只傳送修改的 NAME 欄位
        NAME: editingRow.NAME,
      });
      setOpenDialog(false); // 關閉視窗
      fetchData(); // 更新資料
      setEditingRow(null); // 取消編輯模式
    } catch (error) {
      console.error('Error updating robot:', error);
    }
};

  const handleAddNewRobot = async () => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/robots`, newRobot);
      setOpenDialog(false); // 關閉視窗
      fetchData(); // 更新資料
      setNewRobot({ ID: '', NAME: '' }); // 清空輸入框
    } catch (error) {
      console.error('Error adding new robot:', error);
    }
  };

  const handleDeleteRow = async (row) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/robots/${row.ID}`);
      fetchData(); // 更新資料
    } catch (error) {
      console.error('Error deleting robot:', error);
    }
  };

  // 自訂的 getRowId 函式，這裡假設資料的 id 是 'ID'
  const getRowId = (row) => row['ID'];

  const columns = Object.keys(data[0] || {}).map((key) => ({
    field: key,
    headerName: key,
    width: 150,
  }));

  // 加入兩個按鈕欄位
  columns.push({
    field: 'edit',
    headerName: 'Edit',
    width: 100,
    renderCell: (params) => {
      return (
        <button onClick={() => handleEditRow(params.row)}>Edit</button>
      );
    },
  });

  columns.push({
    field: 'delete',
    headerName: 'Delete',
    width: 100,
    renderCell: (params) => {
      return (
        <button onClick={() => handleDeleteRow(params.row)}>Delete</button>
      );
    },
  });

  return (
      <div style={{ height: 600, width: '100%' }}>
        <div style={{ marginBottom: 10 }}>
        <button  className="button button-breath" onClick={handleAddRobot}>Add Robot</button>
      </div>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        // checkboxSelection
        getRowId={getRowId}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingRow ? 'Edit Robot' : 'Add Robot'}</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="ID"
            value={editingRow ? editingRow.ID : newRobot.ID}
            onChange={handleInputChange}
            label="ID"
            fullWidth
          />
          <TextField
            type="text"
            name="NAME"
            value={editingRow ? editingRow.NAME : newRobot.NAME}
            onChange={handleInputChange}
            label="NAME"
            fullWidth
          />
        </DialogContent>

        {/* <DialogActions>
          <Button  className="button button-breath" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button  className="button button-breath" onClick={editingRow ? handleUpdateRow : handleAddNewRobot}>
            {editingRow ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions> */}

        <DialogActions>
          <div className="button button-breath" onClick={() => setOpenDialog(false)}>
            Cancel
          </div>
          <div
            className={`button button-breath ${editingRow ? '' : 'button-breath'}`}
            onClick={editingRow ? handleUpdateRow : handleAddNewRobot}
          >
            {editingRow ? 'Save Changes' : 'Add'}
          </div>
        </DialogActions>

      </Dialog>
    </div>
  );
};

export default App;
