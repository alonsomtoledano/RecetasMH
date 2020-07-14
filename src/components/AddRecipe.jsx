import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";
import UploadFile from "./UploadFile";

const ADD_RECIPE_MUTATION = gql`
    mutation addRecipe($userid: ID!, $token: String!, $title: String!, $description: String!, $steps: [StepInput!]!, $ingredients: [ID!]!, $mainImage: FileInput!) {
        addRecipe(userid: $userid, token: $token, title: $title, description: $description, steps: $steps, ingredients: $ingredients, mainImage: $mainImage) {
            title
            steps {
                description
                image {
                    mimetype
                }
            }
            ingredients {
                _id
            }
            mainImage {
                mimetype
            }
        }
    }
`;

export default () => {
  const [session] = useRecoilState(sessionState);

  const [addRecipe, { data }] = useMutation(ADD_RECIPE_MUTATION)

  if (data) {
    console.log(data.addRecipe);
  }

  let inputTitle;
  let inputDescription;
  let steps = [];

  return (
    <AddRecipe>
      {!session.token ? <Error>El usuario no ha iniciado sesión correctamente</Error> : 
        <form
        onSubmit = { e => {
            e.preventDefault();
            inputTitle = document.getElementById("inputTitle").value;
            steps = [
              {
                description: document.getElementById("descriptionStep1").value,
                image: {url: "url", mimetype: "mimetype", encoding: "encoding"}
              },
              {
                description: document.getElementById("descriptionStep2").value,
                image: {url: "url", mimetype: "mimetype", encoding: "encoding"}
              },
              {
                description: document.getElementById("descriptionStep3").value,
                image: {url: "url", mimetype: "mimetype", encoding: "encoding"}
              }
            ]
            inputDescription = document.getElementById("inputDescription").value;
            addRecipe({ variables: { userid: session.userid, token: session.token, title: inputTitle, description: inputDescription, 
              steps: steps, ingredients: ["5f0afe3d7375a5043ceb9cef"], mainImage: {url: "url", mimetype: "mimetype", encoding: "encoding"} }});
          }}
        >
          <UploadFile />

          <div>
            <div>Título</div>
            <Input required id="inputTitle"/>
          </div>

          <div>
            <div>Descripción</div>
            <TextareaDescription required type="text" id="inputDescription" />
          </div>

          <div>
            <div>Pasos</div>
            <Step>
              <Textarea required type="text" id="descriptionStep1"/>
              <UploadFile />
            </Step>

            <Step>
              <Textarea required type="text" id="descriptionStep2"/>
              <UploadFile />
            </Step>

            <Step>
              <Textarea required type="text" id="descriptionStep3"/>
              <UploadFile />
            </Step>
          </div>

          <Button type="submit">Añadir Receta</Button>

        </form>
      }
    </AddRecipe>
  );
};

const AddRecipe = styled.div`
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  border: 1px solid #333;
  height: 30px;
  width: 100%;
  margin-bottom: 1em;
`;

const Step = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 1em;
  margin-top: 1em;
  border: 1px solid #333;
`;

const Textarea = styled.textarea`
  display: flex;
  width: 300px;
  height: 100px;
  margin-bottom: 1em;
`;

const TextareaDescription = styled.textarea`
  display: flex;
  width: 100%;
  height: 100px;
  margin-bottom: 1em;
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