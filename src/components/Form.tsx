import { useState } from "react"

const Forms = () => {
const [firstName, setFirstName]    = useState('');
const [lastName, setLastName]    = useState('');
function handleFirstChange(e: any) {

// ✅ Updating a controlled input to e.target.value synchronously
setFirstName(e.target.value);
}
function handleLastChange(e: any) {

// ✅ Updating a controlled input to e.target.value synchronously
setLastName(e.target.value);
}
function handleSubmit(e: any) {
    e.preventDefault();
// ✅ Updating a controlled input to e.target.value synchronously

console.log(firstName)
const form = e.target;
const formData: any = new FormData(form);
setFirstName('');
setLastName('');
// You can pass formData as a fetch body directly:
fetch('/some-api', { method: form.method, body: formData });
// You can generate a URL out of it, as the browser does by default:
console.log(new URLSearchParams(formData).toString());
// You can work with it as a plain object.
const formJson = Object.fromEntries(formData.entries());
console.log(formJson); // (!) This doesn't include multiple select values
// Or you can get an array of name-value pairs.

console.log([...formData.entries()]);
}
return (
  <>
   <form method="post" onSubmit={handleSubmit}>
    <input 
      name="firstName" 
      value={firstName}  // ...force the input's value to match the state variable...
      onChange={e => handleFirstChange(e)} // ... and update the state variable on any edits!
    />
    <input 
      name="lastName" 
      value={lastName}  // ...force the input's value to match the state variable...
      onChange={e => handleLastChange(e)} // ... and update the state variable on any edits!
    />
    <button type="submit">Add</button>
   </form>
   {firstName !== '' && <p>Your name is {firstName}.</p>}
  </>
)

}

export default Forms