import React from "react";
import styled from "styled-components";

import RecipesList from "./RecipesList";
import RecipeDetails from "./RecipeDetails";

export default () => {
  return (
    <RecipesCMS>
      <RecipesList />
      <RecipeDetails />
    </RecipesCMS>
  );
};

const RecipesCMS = styled.div`
  display: flex;
  flex-direction: row;
`;
