import React, { ReactNode, useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"

import { Box, Center, Flex, IconButton } from "@chakra-ui/react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

export interface IProps {
  children?: React.ReactNode
  onSlideChange?: (slideIndex: number) => void
}

const Slider: React.FC<IProps> = ({ children, onSlideChange }) => {
  const [emblaRef, embla] = useEmblaCarousel()
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<Array<number>>([])

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
  const scrollTo = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index)
      }

      if (onSlideChange) {
        onSlideChange(index)
      }
    },
    [embla]
  )

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on("select", () => {
      const index = embla.selectedScrollSnap()
      if (onSlideChange) {
        onSlideChange(index)
      }
      onSelect()
    })
  }, [embla, setScrollSnaps, onSelect])

  return (
    <Box
      position="relative"
      p={8}
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="base"
      w="full"
      bg="sliderBg"
    >
      <Box overflow="hidden" ref={emblaRef}>
        <Flex>{children}</Flex>
      </Box>
      <Flex
        justifyContent={{ sm: "left", base: "center" }}
        mb={{ sm: 0, base: 4 }}
      >
        <IconButton
          aria-label="MdChevronLeft"
          onClick={scrollPrev}
          icon={<MdChevronLeft fontSize={24} focusable={true} />}
          isRound
          mr="0.8rem"
          _hover={{ boxShadow: "none" }}
          _focus={{ boxShadow: "none" }}
          bg={prevBtnEnabled ? "sliderBtnBg" : "sliderBtnBgDisabled"}
          size="sm"
          color={prevBtnEnabled ? "sliderBtnColor" : "sliderBtnColorDisabled"}
        />
        <IconButton
          aria-label="MdChevronRight"
          onClick={scrollNext}
          icon={<MdChevronRight fontSize={24} focusable={true} />}
          isRound
          _hover={{ boxShadow: "none" }}
          _focus={{ boxShadow: "none" }}
          bg={nextBtnEnabled ? "sliderBtnBg" : "sliderBtnBgDisabled"}
          size="sm"
          color={nextBtnEnabled ? "sliderBtnColor" : "sliderBtnColorDisabled"}
        />
      </Flex>
      <Center
        position={{ sm: "absolute" }}
        bottom={{ sm: "2.9rem" }}
        left={{ sm: "calc((100% - 68px)/2)" }}
      >
        {scrollSnaps.map((_, index) => (
          <Box
            key={index}
            backgroundColor={
              index === selectedIndex ? "sliderDotActive" : "sliderDot"
            }
            border={0}
            borderRadius="50%"
            width="5px"
            height="5px"
            padding={0}
            cursor="pointer"
            onClick={() => scrollTo(index)}
            sx={{
              marginRight: "1rem",
              "&:last-child": {
                marginRight: 0,
              },
            }}
          />
        ))}
      </Center>
    </Box>
  )
}

export const EmblaSlide: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      position="relative"
      minWidth="full"
      sx={{
        h2: {
          marginTop: 0,
        },
        h3: {
          marginTop: 0,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default Slider
