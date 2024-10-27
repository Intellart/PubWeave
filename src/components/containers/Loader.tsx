import LinearProgress from "@mui/material/LinearProgress";
import logoImg from "../../assets/images/pubweave_logo.png";

function Loader() {
  return (
    <div className="loader-wrapper">
      <img
        src={logoImg}
        alt="PubWeave Logo"
        className="loader-logo"
        width="40px"
      />
      <LinearProgress
        className="linear-loader"
        sx={{
          color: "#11273F",
        }}
      />
    </div>
  );
}

export default Loader;
