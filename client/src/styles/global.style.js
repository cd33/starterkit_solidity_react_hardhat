import styled from 'styled-components'
import { Link } from 'react-router-dom'

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--dark-grey);
  background-image: ${({ image }) => (image ? `url(${image})` : 'none')};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : 'column')};
  justify-content: ${({ jc }) => (jc ? jc : 'flex-start')};
  align-items: ${({ ai }) => (ai ? ai : 'flex-start')};
  background-color: ${({ bc }) => (bc ? bc : 'none')};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : 'none')};
  background-size: cover;
  background-position: center;
`

export const Text = styled.p`
  color: ${({ color }) => (color ? color : 'black')};
  // font-size: ${({ fs }) => (fs ? `${fs}px` : '18px')};
  font-size: ${({ fs }) => (fs ? fs : '1.25em')};
  // font-size: ${({ fs }) => (fs ? fs : '1.2vw')};
  text-align: center;
  font-weight: ${({ fw }) => (fw ? fw : 700)};
  margin: ${({ margin }) => (margin ? margin : 0)};
  // letter-spacing: 0.1em;
`

export const ScrollButton = styled.div`
  margin-left: 5vw;
  align-self: center;
  height: 9vh;
  width: 9vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 3vh;

  @media (max-width: 1300px) 
  {
    display:none;
  }
`

export const ArrowScrollButton = styled.img`
  height: 4vh;
  filter: invert(42%) sepia(77%) saturate(4464%) hue-rotate(203deg)
    brightness(101%) contrast(104%);
`

export const ImagePhone = styled.img`
  filter: drop-shadow(15px 25px 10px rgba(0, 0, 0, 0.5));
  // width: 15vw;
  width: 15em;
`

export const ImageStore = styled.img`
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
  width: 15em;
`

export const SeparatorHorizontal = styled.div`
  border: 1px solid #E5E5E5;
  margin-top: 4vh;
  margin-bottom: 4vh;
`

export const SeparatorVertical = styled.div`
  width: 96px;
  border: 1px solid #e5e5e5;
  transform: rotate(90deg);
  margin-top: 4vh;

  @media (max-width: 600px)
  {
    display: none;
  }

`

export const AccordeonButton = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(18, 124, 255, 1);
  border-radius: 5vh;
  margin-right: 1vw;
  padding: 3vh;

  @media (max-width: 800px) 
  {
    padding: 1.5vh
  }

  @media (max-width: 450px) 
  {
    padding: 1vh
  }
`

export const ArrowAccordeonButton = styled.img`
  height: 4vh;
  filter: invert(100%) sepia(100%) saturate(13%) hue-rotate(207deg) brightness(104%) contrast(103%);
`

export const Button = styled.button`
  background: ${({ bc }) => (bc ? bc : 'rgba(18, 124, 255, 1)')};
  color: white;
  font-size: 28px;
  padding: 2vh 0 2vh 0;
  border: 2px solid rgba(18, 124, 255, 1);
  border-radius: 7vh;
  width: ${({ width }) => (width ? width : '35vw')};

  :hover {
    background-color: white;
    color: rgba(18, 124, 255, 1);
  }
`

export const ButtonLink = styled(Link)`
  color: #fff;
  text-decoration: none;

  :hover {
    color: #fff;
    text-decoration: none;
  }
`

export const ButtonCounter = styled.button`
  background-color: rgb(18, 124, 255);
  color: white;
  font-size: 2em;
  border: 2px solid rgb(18, 124, 255);
  border-radius: 1em;
  width: 1.5em;

  :hover {
    background-color: ${({ bchover }) => (bchover ? bchover : 'white')};
    color: ${({ colorhover }) => (colorhover ? colorhover : 'rgb(18, 124, 255)')};
  }
`

export const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  background-color: rgb(18, 124, 255);
  color: white;
  // background: black;
  border: none;
  border-radius: 3px;
`