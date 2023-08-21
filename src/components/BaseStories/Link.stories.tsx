import * as React from "react"
import { Box, Center, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import Link from "../Link"

type LinkType = typeof Link

const meta = {
  title: "Molecules / Navigation / Links",
  component: Link,
  decorators: [
    (Story) => (
      <Center maxW="prose">
        <Story />
      </Center>
    ),
  ],
} satisfies Meta<LinkType>

export default meta

type Story = StoryObj<typeof meta>

const MockParagraph = ({ to }: { to?: string }) => (
  <Text>
    Text body normal. Ethereum is open access to digital money and data-friendly
    services for everyone – no matter your background or location. It's a{" "}
    <Link to={to}>community-built</Link> technology behind the cryptocurrency
    ether (ETH) and thousands of applications you can use today.
  </Text>
)

export const InternalLink: Story = {
  args: {
    to: "#",
  },
  render: (args) => <MockParagraph {...args} />,
}

export const ExternalLink: Story = {
  args: {
    to: "https://example.com",
  },
  render: (args) => <MockParagraph {...args} />,
}

export const LinkList: Story = {
  render: () => (
    <Box>
      <Text>
        Text body normal. Ethereum is open access to digital money and
        data-friendly services for everyone – no matter your background or
        location. It's a community-built technology behind the cryptocurrency
        ether (ETH) and thousands of applications you can use today.
      </Text>
      <UnorderedList>
        {Array.from({ length: 9 }).map((_, idx) => (
          <ListItem key={idx + 1}>
            <Link
              to={idx % 2 === 0 ? "https://example.com" : "#"}
            >{`List Item ${idx % 2 === 0 ? "External" : "Internal"} ${
              idx + 1
            }`}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  ),
}
