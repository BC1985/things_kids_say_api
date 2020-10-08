const handleErrors = err => {
  console.log("Error message:", err.message);

  let errors = { kid_name: "", age: "", content: "" };
  // validation errors
  if (err.name.includes("ValidationError")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
module.exports = handleErrors;
