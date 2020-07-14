import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { OK, Error, Title } from "../style/styles";
import { useRecoilState } from "recoil";
import { recipeState } from "../recoil/atoms";

const RECIPES_LIST_QUERY = gql`
  {
    recipes {
      _id
      title
    }
  }
`;


export default () => {
    const [, setRecipe] = useRecoilState(recipeState);

    const { loading, error, data } = useQuery(RECIPES_LIST_QUERY);
    if (loading) return <p>Cargando lista de recetas...</p>;
    if (error) return <p>Error cargando la lista de recetas...</p>;

    return (
        <RecipesList>
        <Title>Recetas Disponibles</Title>
        {data.recipes.map(({ _id, title }) => (
            <div key={_id} onClick={() => setRecipe(_id)}>{title}</div>
        ))}
        </RecipesList>
    );
};

const RecipesList = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
`;
