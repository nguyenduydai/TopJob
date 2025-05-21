import React, { useEffect, useState } from "react";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reload:boolean;
    setReload: (v: boolean) => void;
}
const CandidateModal = (props: IProps) => {
  const { openModal, setOpenModal,reload,setReload } = props;

 
  

  return (
<>
</>
  );
};

export default CandidateModal;
