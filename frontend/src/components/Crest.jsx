import logo from "../assets/logo.jpeg";
export default function Crest({ className = "h-10 w-10" }) {
  return (
    <img 
      src = {logo}
      alt = "DRC Primary School"
      className = {`${className}object-contain`}/>
  );
}
