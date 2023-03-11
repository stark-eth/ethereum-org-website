import { Meta, StoryFn } from "@storybook/react"
import React from "react"
import Slider, { EmblaSlide } from "."

const Component = Slider

export default {
  component: Component,
  subcomponents: { EmblaSlide },
  parameters: {
    // https://storybook.js.org/docs/react/essentials/actions#action-event-handlers
    actions: {
      handles: ["click"],
    },
  },
} as Meta<typeof Component>

const ComponentSlides = () => (
  <>
    <EmblaSlide>
      <h3>Cheaper and Faster Crossborder Payments</h3>
      <p>
        <b>Stable coins</b> are a novel type of cryptocurrency that relies on a
        more stable asset as the basis for its value. Most of them are linked to
        the United States dollar and therefore maintain the value of that
        currency. These allow for a very cheap and stable global payment system.
        Many current stablecoins are built on the Ethereum network.
      </p>
      <p>
        Ethereum and stablecoins simplify the process of sending money overseas.
        It often takes only few minutes to move funds across the globe, as
        opposed to the several business days or even weeks that it may take your
        average bank, and for a fraction of the price. Additionally, there is no
        extra fee for making a high value transaction, and there are zero
        restrictions on where or why you are sending your money.
      </p>
    </EmblaSlide>
    <EmblaSlide>
      <h3>The Quickest Help in Times of Crisis</h3>
      <p>
        If you are lucky enough to have multiple banking options through trusted
        institutions where you live, you may take for granted the financial
        freedom, security and stability that they offer. But for many people
        around the world facing political repression or economic hardship,
        financial institutions may not provide the protection or services they
        need.
      </p>
      <p>
        When war, economic catastrophes or crackdowns on civil liberties struck
        the residents of{" "}
        <a href="https://time.com/5486673/bitcoin-venezuela-authoritarian/">
          Venezuela
        </a>
        ,{" "}
        <a href="https://www.economist.com/the-americas/2021/10/30/cubas-communist-regime-is-trying-to-control-crypto">
          Cuba
        </a>
        ,{" "}
        <a href="https://www.aljazeera.com/news/2022/3/21/crypto-provides-fix-for-some-in-crisis-hit-afghanistan">
          Afghanistan
        </a>
        ,{" "}
        <a href="https://qz.com/africa/1922466/how-bitcoin-powered-nigerias-endsars-protests/">
          Nigeria
        </a>
        ,{" "}
        <a href="https://www.euronews.com/my-europe/2021/12/22/meet-the-ngo-turning-to-cryptocurrencies-to-help-desperate-belarusians">
          Belarus
        </a>
        , and{" "}
        <a href="https://internationalbanker.com/finance/cryptocurrencies-filling-crucial-role-in-the-russia-ukraine-conflict/">
          Ukraine
        </a>
        , cryptocurrencies constituted the quickest and often the only option to
        retain financial agency.
        <sup>
          <a href="https://www.financialinclusion.tech/">1</a>
        </sup>{" "}
        As seen in these examples, cryptocurrencies like Ethereum can provide
        unfettered access to the global economy when people are cut off from the
        outside world. Additionally, stablecoins offer a store of value when
        local currencies are collapsing due to superinflation.
      </p>
    </EmblaSlide>
  </>
)

export const Basic: StoryFn<typeof Component> = (args) => (
  <Component {...args}>
    <ComponentSlides />
  </Component>
)
