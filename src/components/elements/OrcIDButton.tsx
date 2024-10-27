type Props = {
  orcid: string,
};

function OrcIDButton(props: Props) {
  return (
    <div
      className="orcid-button"
      onClick={() => {
        // open in new tab
        window.open(`https://orcid.org/${props.orcid}`, "_blank");
      }}
    >
      <img
        alt="ORCID logo"
        src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
        width="16"
        height="16"
      />
      <p>ORCID {props.orcid}</p>
    </div>
  );
}

export default OrcIDButton;
