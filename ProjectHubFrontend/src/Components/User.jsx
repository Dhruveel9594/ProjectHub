import React, { useState, useEffect } from 'react'

export const User = () => {
    const[users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8090/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    }, []);

  return (
    <>
      {users.map((user) => (
        <li key={user.id}>
            {user.fullName} - {user.email}
            
        </li>
      ))}
    </>
  )
}
export default User;
