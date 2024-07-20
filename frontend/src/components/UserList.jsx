import React from 'react';

function UserList({ users }) {
  console.log('Users in UserList:', users);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">Category: {user.category}</p>
            <p className="text-gray-600">
              Address: {user.alamat || 'Not specified'}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No users found</p>
      )}
    </div>
  );
}

export default UserList;