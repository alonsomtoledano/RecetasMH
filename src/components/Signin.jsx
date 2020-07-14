import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import styled from "styled-components";
import { OK, Error, Title } from "../style/styles";

const SIGNIN = gql`
    mutation signin($userName: String!, $pwd: String!) {
        signin(userName: $userName, pwd: $pwd) {
            userName
        }
    }
`;

export default () => {
    let inputUserName;
    let inputPwd;

    const [error, setError] = useState(null);
    const [signin, { data }] = useMutation(SIGNIN, {
        onError(err) {
            setError("El usuario ya existe");
        }
    })

    return (
        <Signin>
            <Title>Signin</Title>
            <form className="ModuleSignin"
                onSubmit = { e => {
                    e.preventDefault();
                    inputUserName = document.getElementById("inputUserName").value;
                    if (document.getElementById("inputPwd").value === document.getElementById("inputPwd2").value) {
                        inputPwd = document.getElementById("inputPwd").value;
                        signin({ variables: { userName: inputUserName, pwd: inputPwd }});
                    } else {
                        setError("La contraseña no coincide");
                    }
                }}
            >
                <Signin>
                    <Input required id="inputUserName" placeholder="Nombre de usuario"/>
                    <Input required id="inputPwd" type="password" placeholder="Contraseña" />
                    <Input required id="inputPwd2" type="password" placeholder="Contraseña" />

                    {data ? <OK>Usuario {data.signin.userName} creado</OK> : null}
                    {error ? <Error>{error}</Error> : null}

                    <Button type="submit" onClick={() => setError(null)}>Enviar</Button>
                </ Signin>
            </form>
        </Signin>
    )
}

const Signin = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  border: 1px solid #333;
  height: 30px;
  width: 500px;
`;

const Button = styled.button`
  color: black;
  font-weight: bold;
  height: 30px;
  width: 500px;
  border: 1px solid #333;
  &:hover {
    background-color: #bbbbbb;
    cursor: pointer;
  }
`;