declare module "rebass" {
  import * as React from "react";

  type Component<T> = React.ComponentType<
    T & {
      is?: string | React.ComponentType<any>;
    }
    >;

  interface SpaceProps {
    m?: number;
    mt?: number;
    mr?: number;
    mb?: number;
    ml?: number;
    mx?: number;
    my?: number;
    p?: number;
    pt?: number;
    pr?: number;
    pb?: number;
    pl?: number;
    px?: number;
    py?: number;
  }

  interface ColorProps {
    color?: string;
    bg?: string;
  }

  interface WidthProps {
    width?: number | string;
  }

  interface FontSizeProps {
    fontSize?: number | string;
  }

  interface FlexProps {
    flex?: string;
  }

  interface OrderProps {
    order?: number;
  }

  interface AlignSelfProps {
    alignSelf?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  }

  interface FontFamilyProps {
    fontFamily?: string;
  }

  interface FontWeightProps {
    fontWeight?: number | string;
  }

  interface TextAlignProps {
    textAlign?: "left" | "right" | "center" | "justify" | "inherit";
  }

  interface LineHeightProps {
    lineHeight?: number;
  }

  interface RatioProps {
    ratio?: number;
  }

  interface BackgroundSizeProps {
    backgroundSize?: number | string;
  }

  interface BackgroundPositionProps {
    backgroundPosition?: number | string;
  }

  export declare const Flex: React.CompnentType<
    WidthProps &
    SpaceProps &
    FontSizeProps &
    ColorProps &
    FlexProps &
    OrderProps &
    AlignSelfProps
    >;

  export declare const Box: Component<
    FlexWrapProps & FlexDirectionProps & AlignItemsProps & JustifyContentProps
    >;

  export declare const Text: Component<
    SpaceProps &
    ColorProps &
    FontFamilyProps &
    FontSizeProps &
    FontWeightProps &
    TextAlignProps &
    LineHeightProps
    >;

  export declare const BackgroundImage: Component<
    RatioProps &
    BackgroundSizeProps &
    BackgroundPositionProps &
    SpaceProps &
    ColorProps & {
      src: string;
    }
    >;
}
