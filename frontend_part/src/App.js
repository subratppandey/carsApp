import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';

function Cars() {

  const Context = createContext([]);
  const [cars, setCars, refresh, setRefresh]  = useContext(Context);

  useEffect(() => {
    fetch('http://localhost:5000/list')
    .then(res => res.json())
    .then((result) => {
        setCars(result);
    });
  }, [refresh]);
  
  const carFormInitialData = {
    id: 0,
    brand:'',
    name: '',
    releaseYear:"",
    color:""
  }

  const [carFormData, setCarFormData] = useState(carFormInitialData);

  const handleInputChange = (e) => {
    const { brand, name, releaseYear, color, value } = e.target;
    setCarFormData({
      ...carFormData,
      [name]: value,
      [brand]: value,
      [releaseYear]: value,
      [color]: value
    });
  }

  const postHandler = async (event) => {
    let res = await fetch("http://localhost:8000/save", {
        method: "POST",
        body: JSON.stringify({
          id: event.target.id.value,
          brand: event.target.brand.value,
          name: event.target.name.value,
          releaseYear: event.target.releaseYear.value,
          color: event.target.color.value
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => setRefresh(!refresh));
  }

  const putHandler = async (event) => {
    let res = await fetch("http://localhost:8000/edit", {
        method: "PUT",
        body: JSON.stringify({
          id: event.target.id.value,
          brand: event.target.brand.value,
          name: event.target.name.value,
          releaseYear: event.target.releaseYear.value,
          color: event.target.color.value
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => setRefresh(!refresh));
  }

  const handleSubmit = (event) => {
    
    event.preventDefault();
    let submit = document.getElementById("submit");
    
    if (submit.value === "Update") {
        putHandler(event);
    } else {
        postHandler(event);
    }
    event.target.reset();
  }

  const handleDelete = async (e) => {

     e.preventDefault();
     let res = await fetch("http://localhost:8000/delete", {
     method: "DELETE",
     body: JSON.stringify({
       id: e.target.parentElement.id
     }),
     headers: { 'Content-Type': 'application/json' },
   }).then(res => setRefresh(!refresh));  
  }
 
  return (
    <div className='cars-from-wrapper'>
      <form id="cars-form" onSubmit={handleSubmit} autoComplete="off"> 
        <label>
          ID:
          <input name='id' type="text" value={carFormData.id} onChange={handleInputChange} />
        </label>
        <label>
          Brand:
          <input name='brand' type="text" value={carFormData.brand} onChange={handleInputChange} />
        </label>
        <label>
          Name:
          <input name='name' type="text" value={carFormData.name} onChange={handleInputChange} />
        </label>
        <label>
          Release Year:
          <input name='releaseYear' type="text" value={carFormData.releaseYear} onChange={handleInputChange} />
        </label>
        <label>
          Color:
          <input name='color' type="text" value={carFormData.color} onChange={handleInputChange} />
        </label>
        <input id = "submit" type="submit" value="Submit" />
      </form>
       
      <p>ID:{carFormData.id}, Brand:{carFormData.brand}, Name:{carFormData.name}, Release Year:{carFormData.releaseYear}, Color:{carFormData.color}</p>

      <h2>Cars Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Make</th>
            <th>Car Model</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
                  
          {cars.map(function(car){
            return <tr key={ car.id }><td>{car.id}</td><td>{car.brand}</td><td>{car.name}</td><td>{car.releaseYear}</td><td>{car.color}</td><td id={car.id} brand={car.brand} name={car.name} releaseYear={car.releaseYear} color={car.color}><i onClick={handleDelete} className="bi bi-trash"></i> &nbsp;&nbsp; <i className='bi bi-pencil' onClick={handleEdit}></i></td></tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Cars;