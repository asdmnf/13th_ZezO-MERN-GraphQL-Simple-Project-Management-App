import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_USER } from "../GraphQl/Mutations/userMutation";
import swalToast from "../Utils/swalToast";
import { GET_ALL_USERS } from "../GraphQl/Queries/userQuery";

const UserModalHook = () => {

  // define states
  const [show, setShow] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  // create user mutation
  const [createUser, {loading}] = useMutation(CREATE_USER, {
    variables: {
      name: nameValue,
      email: emailValue,
      phone: phoneValue
    },
    onCompleted: () => { 
      setShow(false);
      setNameValue("");
      setEmailValue("");
      setPhoneValue("");
      swalToast("success", "user created successfully");
    },
    onError: () => { 
      swalToast("error", "something went wrong");
    },

    // update getAllUsers cache
    update: (cache, {data}) => {
      const {getAllUsers} = cache.readQuery({query: GET_ALL_USERS}); 
      cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          getAllUsers: [...getAllUsers, data.createUser]
        }
      })
    }
  })

  // modal controls
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // input change handlers
  const nameInputOnChangeHandle = (e) => {
    setNameValue(e.target.value);
  }

  const emailInputOnChangeHandle = (e) => {
    setEmailValue(e.target.value);
  }

  const phoneInputOnChangeHandle = (e) => {
    setPhoneValue(e.target.value);
  }
  
  // add user click handler
  const addUserOnClickHandle = (e) => {
    e.preventDefault();
    if (!nameValue || !emailValue || !phoneValue) {
      swalToast("warning", "all fields are required");
      return;
    }
    createUser(nameValue, emailValue, phoneValue);
  }

  return [show, handleClose, handleShow, nameValue, emailValue, phoneValue, addUserOnClickHandle, nameInputOnChangeHandle, emailInputOnChangeHandle, phoneInputOnChangeHandle, loading]
}

export default UserModalHook