import React, { useEffect, useState } from 'react'

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

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false); // Track form submission success

  useEffect(() => {
    // Validate full name
    const fullNameError = formData.fullName.length < 3 || formData.fullName.length > 20
      ? validationErrors.fullNameTooShort
      : '';

    // Validate size
    const sizeError = !['S', 'M', 'L'].includes(formData.size)
      ? validationErrors.sizeIncorrect
      : '';

    // Set errors
    setErrors({
      fullName: fullNameError,
      size: sizeError,
    });
  }, [formData.fullName, formData.size]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitSuccess(true);
  };
  
  const renderSuccessMessage = () => {
    const { fullName, size, toppings } = formData;
    const toppingsNumber = toppings.length;
    const toppingText = toppingsNumber === 0 ? 'with no toppings' : `with ${toppingsNumber} topping${toppingsNumber > 1 ? 's' : ''}`;
    return `Thank you for your order, ${fullName}! Your ${size} pizza ${toppingText}.`;
  };

  return (
    <form onSubmit={handleSubmit}>
    <h2>Order Your Pizza</h2>
    {submitSuccess && <div className='success'>{renderSuccessMessage()}</div>}
    {Object.keys(errors).some(error => error !== '') && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          {errors.fullName && <div className='error'>{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          >
            <option value="">----Choose Size----</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
          {errors.size && <div className='error'>{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              checked={formData.toppings.includes(topping.text)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData(prevState => ({
                  ...formData,
                  toppings: isChecked
                    ? [...prevState.toppings, topping.text]
                    : prevState.toppings.filter(item => item !== topping.text),
                }));
              }}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      <input type="submit" disabled={Object.values(errors).some(error => error !== '')} />
    </form>
  )
}
