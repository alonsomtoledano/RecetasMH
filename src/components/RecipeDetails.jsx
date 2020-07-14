import React, {useEffect} from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { OK, Error, Title } from "../style/styles";
import { useRecoilState } from "recoil";
import { recipeState } from "../recoil/atoms";

const RECIPE_DETAILS_QUERY = gql`
    query recipe($id: ID!) {
        recipe( id: $id ) {
            title
            description
            steps {
                description
                image {
                    url
                    mimetype
                }
            }
            date
            ingredients {
                _id
                name
            }
            mainImage {
                url
                mimetype
            }
        }
    }
`;

export default () => {
    const [recipe] = useRecoilState(recipeState);

    const { loading, data } = useQuery(RECIPE_DETAILS_QUERY, {
        variables: { id: recipe },
        notifyOnNetworkStatusChange: true,
    });
    if (loading) return <p>Cargando receta...</p>; 

    let content;
    if (data) {
        content =
            <Recipe>
                <Details>
                    <Title>{data.recipe.title}</Title>
                    <Date>{data.recipe.date}</Date>
                    <MainImage className="Img" src={"http://77.228.91.193/" + data.recipe.mainImage.url} alt={data.recipe.mainImage.mimetype}/>
                    <Description>{data.recipe.description}</Description>
                    {data.recipe.steps.map(({ description, image }) => (
                        <Step key={description}>
                            <StepImage className="Img" src={"http://77.228.91.193/" + image.url} alt={image.mimetype}/>
                            {description}
                        </Step>
                    ))}
                </Details>

                <Ingredients>
                <Title>Ingredientes</Title>
                {data.recipe.ingredients.map(({ _id, name }) => (
                    <Ingredient key={_id}>• {name}</Ingredient>
                ))}
                </Ingredients>
            </Recipe>
    }

    return (
        <div>{content}</div>
    );
};

const Recipe = styled.div`
    display: flex;

    width: 100%;
`;
const Details = styled.div`
  margin-top: 1em;
  width: 75%;
`;
const Ingredients = styled.div`
  margin-top: 1em;
  width: 25%;
`;
const Description = styled.div`
  margin-top: 1em;
`;
const Date = styled.div`
  margin-top: 1em;
`;
const Ingredient = styled.div`
  margin-top: 1em;
  margin-left: 1em;
`;
const Step = styled.div`
    display: flex;
    margin-top: 1em;
`;
const MainImage = styled.img`
    margin-top: 1em;
    width: 100%;
    object-fit: cover;
`;
const StepImage = styled.img`
    width: 200px;
    object-fit: cover;
    margin-right: 1em;
`;