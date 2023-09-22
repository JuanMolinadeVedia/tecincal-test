import React, { useEffect, useState } from "react";

const UserList = () => {
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);
  // Estado para almacenar la propiedad seleccionada para agrupar
  const [selectedProp, setSelectedProp] = useState("roles");
  // Estado para almacenar usuarios agrupados por la propiedad seleccionada
  const [groupedUsers, setGroupedUsers] = useState({});

  // Función para cargar datos de usuarios y agruparlos al inicio y cuando cambia la propiedad seleccionada
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://643ecf8ec72fda4a0b01bc66.mockapi.io/api/v1/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        groupUsersByProperty(data, selectedProp); // Agrupa usuarios al cargar datos
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [selectedProp]);

  // Función para agrupar usuarios por una propiedad específica
  const groupUsersByProperty = (userList, property) => {
    const grouped = {};
    userList.forEach((user) => {
      const value = user[property]?.[0] || "No " + property;
      if (!grouped[value]) {
        grouped[value] = [];
      }
      grouped[value].push(user);
    });
    setGroupedUsers(grouped);
  };

  // Manejar el cambio en la propiedad seleccionada
  const handlePropSelect = (e) => {
    const selectedProperty = e.target.value;
    setSelectedProp(selectedProperty);
    groupUsersByProperty(users, selectedProperty); // Reagrupa usuarios cuando cambia la propiedad
  };

  return (
    <div>
      <h1>User Lists</h1>
      {/* Selector de propiedad */}
      <label htmlFor="propSelect">Select Property:</label>
      <select id="propSelect" value={selectedProp} onChange={handlePropSelect}>
        <option value="roles">Roles</option>
        <option value="tags">Tags</option>
      </select>
      {/* Mostrar usuarios agrupados */}
      {Object.keys(groupedUsers).map((property) => (
        <div key={property}>
          <h2>{property}</h2>
          <ul>
            {groupedUsers[property].map((user) => (
              <li key={user.id}>
                {user.avatar && (
                  <img src={user.avatar} alt={`${user.name}'s Avatar`} />
                )}
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UserList;
