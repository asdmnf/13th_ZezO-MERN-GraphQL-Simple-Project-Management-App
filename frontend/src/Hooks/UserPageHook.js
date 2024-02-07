import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GET_ONE_USER } from "../GraphQl/Queries/userQuery"
import { DELETE_USER, UPDATE_USER } from "../GraphQl/Mutations/userMutation"
import swalToast from "../Utils/swalToast"
import { GET_ALL_PROJECTS } from "../GraphQl/Queries/projectQuery"
import swalDeleteUserConfirmation from "../Utils/swalDeleteUserConfirmation"

const UserPageHook = () => {
  // get user id
  const {userId} = useParams()

  // define navigate
  const navigateTo = useNavigate()

  // define states
  const [nameValue, setNameValue] = useState('Loading...')
  const [emailValue, setEmailValue] = useState('Loading...')
  const [phoneValue, setPhoneValue] = useState('Loading...')

  // user query
  const {error, loading: getUserLoading, data} = useQuery(GET_ONE_USER, {
    variables: {id: userId},
    onCompleted: () => {
      setNameValue(data.getOneUser.name)
      setEmailValue(data.getOneUser.email)
      setPhoneValue(data.getOneUser.phone)
    }
  })

  // update user mutation
  const [updateUser, {loading: updateUserLoading}] = useMutation(UPDATE_USER, {
    variables: {
      id: userId,
      name: nameValue,
      email: emailValue,
      phone: phoneValue
    },
    onCompleted: () => {
      swalToast("success", "user updated successfully");
      window.scrollTo({
        top: 0,
      });
    },
    onError: () => {
      swalToast("error", "something went wrong");
    },
    update: (cache, {data}) => {
      cache.writeQuery({
        query: GET_ONE_USER,
        data: {
          getOneUser: data.updateUser
        }
      })
    }
  })

  // delete user mutation
  const [deleteUser, {loading: deleteUserLoading}] = useMutation(DELETE_USER, {
    variables: {
      id: userId
    },
    onCompleted: () => {
      swalToast("success", "user deleted successfully");
      navigateTo("/");
      window.scrollTo({
        top: 0,
      });
    },
    onError: () => {
      swalToast("error", "something went wrong");
    },
    update: (cache) => {
      cache.evict({id: `User:${userId}`});
      cache.gc();
    },
    refetchQueries: [{query: GET_ALL_PROJECTS}],
  })

  // input change handlers
  const nameInputOnChangeHandle = (e) => {
    setNameValue(e.target.value)
  }

  const emailInputOnChangeHandle = (e) => {
    setEmailValue(e.target.value)
  }

  const phoneInputOnChangeHandle = (e) => {
    setPhoneValue(e.target.value)
  }

  // update user click handler
  const updateUserOnClickHandle = () => {
    updateUser(nameValue, emailValue, phoneValue)
  }

  // delete user click handler
  const deleteUserOnClickHandle = () => {
    swalDeleteUserConfirmation(deleteUser, userId)
  }

  return [nameValue, emailValue, phoneValue, nameInputOnChangeHandle, emailInputOnChangeHandle, phoneInputOnChangeHandle, updateUserOnClickHandle, deleteUserOnClickHandle, data, error, getUserLoading, updateUserLoading, deleteUserLoading]
}

export default UserPageHook