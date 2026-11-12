declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  const icons: { [key: string]: LucideIcon };
  export default icons;
}

