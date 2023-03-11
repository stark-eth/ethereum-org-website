import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { Center, Heading, Flex, Image, Stack } from "@chakra-ui/react"

import { getImage } from "../../utils/image"

export interface IProps {
  children: React.ReactNode
  title: String
}

const RoadmapImageContent: React.FC<IProps> = ({ children, title }) => {
  const data = useStaticQuery(graphql`
    query RoadmapImageContent {
      robot: file(relativePath: { eq: "wallet.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 580
            layout: CONSTRAINED
            placeholder: BLURRED
            quality: 100
          )
        }
      }
    }
  `)

  return (
    <Stack mb={1} mt={16}>
      <Heading as="h3" mt={0}>
        {title}
      </Heading>
      <Flex flexDir={{ base: "column", lg: "row" }}>
        <Stack mb={4}>{children}</Stack>
        <Center>
          <Image
            as={GatsbyImage}
            image={getImage(data.robot)!}
            alt="Ethereum Wallet"
            w="350px"
          />
        </Center>
      </Flex>
    </Stack>
  )
}

export default RoadmapImageContent
