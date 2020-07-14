import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
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

const INGEDIENTS_LIST_QUERY = gql`
  {
    ingredients {
      _id
      name
    }
  }
`;

export default () => {
  const [session] = useRecoilState(sessionState);

  const [addRecipe, {dataRecipe}] = useMutation(ADD_RECIPE_MUTATION)
  const { data } = useQuery(INGEDIENTS_LIST_QUERY);

  let inputTitle;
  let inputDescription;
  let ok;
  const ingredients = [];

  const mainImage = {
    url: null,
    mimetype: null,
    encoding: null
  }

  const steps = [
    {
      description: null,
      image: {
        url: null,
        mimetype: null,
        encoding: null
      }
    },
    {
      description: null,
      image: {
        url: null,
        mimetype: null,
        encoding: null
      }
    },
    {
      description: null,
      image: {
        url: null,
        mimetype: null,
        encoding: null
      }
    }
  ];

  function removeIngredient(elem) {
    let index = ingredients.indexOf(elem);
    if (index > -1) {
      ingredients.splice(index, 1);
    }
  }

  return (
    <AddRecipe>
      {!session.token ? <Error>El usuario no ha iniciado sesión correctamente</Error> : 
        <form
        onSubmit = { e => {
            e.preventDefault();
            inputTitle = document.getElementById("inputTitle").value;
            inputDescription = document.getElementById("inputDescription").value;

            steps[0].description = document.getElementById("descriptionStep1").value;
            steps[1].description = document.getElementById("descriptionStep2").value;
            steps[2].description = document.getElementById("descriptionStep3").value;

            addRecipe({ variables: { userid: session.userid, token: session.token, title: inputTitle, description: inputDescription, 
              steps: steps, ingredients: ingredients, mainImage: mainImage }});
              
            ok = <OK>Usuario {data.signin.userName} creado</OK>;
          }}
        >
          <UploadFile mainImage={mainImage}/>

          <div>
            <Title>Título</Title>
            <Input required id="inputTitle"/>
          </div>

          <div>
            <Title>Descripción</Title>
            <TextareaDescription required type="text" id="inputDescription" />
          </div>

          <div>
            <Title>Pasos</Title>
            <Step>
              <Textarea required type="text" id="descriptionStep1"/>
              <UploadFile stepImage={steps[0].image}/>
            </Step>

            <Step>
              <Textarea required type="text" id="descriptionStep2"/>
              <UploadFile stepImage={steps[1].image}/>
            </Step>

            <Step>
              <Textarea required type="text" id="descriptionStep3"/>
              <UploadFile stepImage={steps[2].image}/>
            </Step>
          </div>

          <div>
            <Title>Ingredientes Disponibles</Title>
            {data ? data.ingredients.map(({ _id, name }) => (
              <Ingredient key={_id}> <input type="checkbox" onClick={() => ingredients.includes(_id) ? removeIngredient(_id) : ingredients.push(_id)}/> {name}</Ingredient>
            )) : null}
          </div>

          {ok}

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

const Ingredient = styled.div`
  margin-left: 1em;
`;