import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

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
  size: Yup.string().matches(/^(S|M|L)$/, validationErrors.sizeIncorrect).required(),
});

export default function Form() {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [fullName, setFullName] = useState('');
  const [size, setSize] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedToppings, setSelectedToppings] = useState({});

  useEffect(() => {
    setSubmitDisabled(Object.keys(errors).length > 0 || !fullName || !size);
  }, [errors, fullName, size]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedToppings({
      ...selectedToppings,
      [name]: checked
    });
  };

  const renderSuccessMessage = () => {
    const toppingsNumber = Object.values(selectedToppings).filter(Boolean).length;
    const toppingText = toppingsNumber === 0 ? 'with no toppings' : `with ${toppingsNumber} topping${toppingsNumber > 1 ? 's' : ''}`;
    const successMessage = `Thank you for your order, ${fullName}! Your ${size} pizza ${toppingText} is on the way.`;
    alert(successMessage);
    setSuccess(true);
    setFailure(false);
    setFullName('');
    setSize('');
    setSelectedToppings({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await schema.validate(data, { abortEarly: false });
      renderSuccessMessage();
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
          Thank you for your order, {fullName}! Your {size} pizza {toppings.length > 0 ? 'with ' : ' '} {Object.values(selectedToppings).filter(Boolean).length} {toppings.length > 0 ? 'topping' : ' '} {toppings.length > 0 && 's'} is on the way.
        </div>
      )}
      {failure && <div className='failure'>Something went wrong. Please check your inputs.</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" name="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          {errors.fullName && <div className='error'>{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={size} onChange={(e) => setSize(e.target.value)}>
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
