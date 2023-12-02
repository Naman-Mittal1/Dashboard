import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./Dashboard.css";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState([]);  
    const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setUsers(data);
      setNumPages(Math.ceil(data.length / 10)); 
    }
    fetchData();
    
  }, []);


  function searchUsers(query) {
    let filteredUsers = [];
    if(query) {
      filteredUsers = users.filter(user => user.name.includes(query)); 
    } else {
      filteredUsers = users;
    }
    setUsers(filteredUsers);
    setPage(1);
    setNumPages(Math.ceil(filteredUsers.length / 10));
  }


  function toggleSelect(user) {

    setSelected(selected => {
      if(selected.includes(user)) {
        return selected.filter(u => u !== user)
      } else {
        return [...selected, user]
      }
    });
  }

  function editUser(user) {
    // API call to edit user
  }

  function deleteUser(user) {
    setUsers(users.filter((u) => u.id !== user.id));
  }

  function selectAll(checked) {

    const pageUsers = users.slice((page-1)*10, page*10);
    
    setSelected(checked ? 
      selected.concat(pageUsers) :
      selected.filter(u => !pageUsers.includes(u))  
    );
  
  }

  
  function renderPages() {
    const pages = []; 
  
    for(let i=1; i<= numPages; i++) {
      pages.push(
        <button 
          key={i}
          className={i === page ? 'active' : ''}
          onClick={() => setPage(i)}  
        >
          {i}
        </button> 
      );
    }
  
    return pages;
  }
  

//   function changePage(page) {
//     setPage(page);
//   }

  
  return (
    <div className="dashboard">
      <div className="toolbar">
        <FaSearch className="search-icon" />
        <input
          placeholder="Search users"
          onChange={(e) => searchUsers(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === 10}
                onChange={(e) => selectAll(e.target.checked)}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.slice((page - 1) * 10, page * 10).map((user) => (
            <tr
            onClick={() => toggleSelect(user)}
            >
              <td>
              <input 
        type="checkbox"
        checked={selected.includes(user)} 
      />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <FaRegEdit className="edit" onClick={() => editUser(user)} />
                <MdDelete className="delete" onClick={() => deleteUser(user)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
    <button onClick={()=>setPage(1)}>First</button>
    {/* <button disabled={page===1} onClick={()=>setPage(page-1)}>Prev</button>   } // for Prev Button */}

    
    {renderPages()}
    {/* <button disabled={page===numPages} onClick={()=>setPage(page+1)}>Next</button> }  for next button   */}
    <button onClick={()=>setPage(numPages)}>Last</button> 
  </div>
    </div>
  );
};

export default Dashboard;
