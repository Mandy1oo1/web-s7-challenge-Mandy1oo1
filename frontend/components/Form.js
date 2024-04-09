import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';


// Validation schema
const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L'
}; 


const schema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
  size: Yup.string()
    .matches(/^(S|M|L)$/, validationErrors.sizeIncorrect)
    .required(),
});

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  useEffect(() => {
    if (formSuccess) {
      setSuccessMessage(`Thank you for your order, ${formData.fullName}! Your ${formData.size.toLowerCase()} pizza with ${formData.toppings.length > 0 ? formData.toppings.length : 'no'} topping${formData.toppings.length !== 1 ? 's' : ''}.`);
    } else {
      setSuccessMessage('');
    }
  }, [formSuccess, formData]);


  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [formFailure, setFormFailure] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      // Form is valid, perform submit action (e.g., send data to backend)
      setFormSuccess(true);
      setFormFailure(false);
      // Reset form
      setFormData({ fullName: '', size: '', toppings: [] });
    } catch (error) {
      // Form validation failed
      const errors = {};
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setFormErrors(errors);
      setFormSuccess(false);
      setFormFailure(true);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {formSuccess && <div className='success'>{successMessage}</div>}
      {formFailure && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {formErrors.size && <div className='error'>{formErrors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              checked={formData.toppings.includes(topping.topping_id)}
              onChange={handleInputChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      
      <input type="submit" disabled={!formData.fullName || !formData.size} />
      <Link to="/">Back to Home</Link>
    </form>
  );
  
}
