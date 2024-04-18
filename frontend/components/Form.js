import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

export default function Form() {
  const validationErrors = {
    fullNameTooShort: 'full name must be at least 3 characters',
    fullNameTooLong: 'full name must be at most 20 characters',
    sizeIncorrect: 'size must be S or M or L'
  }

  const toppings = [
    { topping_id: '1', text: 'Pepperoni' },
    { topping_id: '2', text: 'Green Peppers' },
    { topping_id: '3', text: 'Pineapple' },
    { topping_id: '4', text: 'Mushrooms' },
    { topping_id: '5', text: 'Ham' },
  ]

  const schema = Yup.object().shape({
    fullName: Yup.string().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong).required(),
    size: Yup.string().matches(/^(S|M|L)$/, validationErrors.sizeIncorrect),
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [fullName, setFullName] = useState('');
  const [size, setSize] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedToppings, setSelectedToppings] = useState({});
  const [successMessage, setSuccessMessage] = useState('')
  const [fullNameTouched, setFullNameTouched] = useState(false)
  const [sizeTouched, setSizeTouched] = useState(false)

  useEffect(() => {
    setSubmitDisabled(Object.keys(errors).length > 0 || !fullName || !size);
  }, [errors, fullName, size]);

  const validateForm = async () => {
    const data = {
      fullName: fullName,
      size: size,
    };
  
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      const errors = {};
      if (validationError.inner) {
        validationError.inner.forEach(error => {
          errors[error.path] = error.message;
        });
      } else {
        errors[validationError.path] = validationError.message;
      }
      console.log(errors)
      if (!fullNameTouched){
        errors.fullName = null
      }
      if (!sizeTouched){
        errors.size = null
      }
      setErrors(errors);
    }
  };

  useEffect(() =>{
    validateForm()
  }, [fullName, size]) 

  const handleFullNameChange = (e) => {
    if (e.target.value.length > 0){
      e.target.value = e.target.value.trim()
    }
    setFullName(e.target.value);
    setFullNameTouched(true)
    // validateForm();
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
    setSizeTouched(true)
    // validateForm();
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedToppings({
      ...selectedToppings,
      [name]: checked
    });
  };

  const createSuccessMessage = () => {
    const pizzaSizes = {
      'S': 'small',
      'M': 'medium',
      'L': 'large',
    }
    const toppingsNumber = Object.values(selectedToppings).filter(Boolean).length;
    const toppingText = toppingsNumber === 0 ? 'with no toppings' : `with ${toppingsNumber} topping${toppingsNumber > 1 ? 's' : ''}`;
    const newSuccessMessage = `Thank you for your order, ${fullName}! Your ${pizzaSizes[size]} pizza ${toppingText} is on the way.`;
    setSuccessMessage(newSuccessMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
      await schema.validate(data, { abortEarly: false });
      createSuccessMessage();
      setSuccess(true);
      setFailure(false);
      setFullName('');
      setSize('');
      setSelectedToppings({});
      setErrors({}); 
    } catch (validationError) {
      const errors = {};
      if (validationError.inner) {
        validationError.inner.forEach(error => {
          errors[error.path] = error.message;
        });
      } else {
        errors[validationError.path] = validationError.message;
      }
      setErrors(errors);
      setSuccess(false);
      setFailure(true);
    }
  };
   

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && (
  <div className='success'>
    {successMessage}
  </div>
)}
      {failure && <div className='failure'>Something went wrong. Please check your inputs.</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" name="fullName" type="text" value={fullName} onChange={handleFullNameChange} />
          {errors.fullName && <div className='error'>{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={size} onChange={handleSizeChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {errors.size && <div className='error'>{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              checked={selectedToppings[topping.text] || false}
              onChange={handleCheckboxChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      <input type="submit" disabled={submitDisabled} />
    </form>
  );
}
