// "use client";

// import { ConvexProvider, ConvexReactClient } from "convex/react";
// import { ReactNode } from "react";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return <ConvexProvider client={convex}>{children}</ConvexProvider>;
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1. doesnt require jwt token

"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

//2. does require jwt token
// "use client";

// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { ConvexReactClient } from "convex/react";
// import { useAuth } from "@clerk/nextjs";
// import { ReactNode } from "react";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return (
//     <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//       {children}
//     </ConvexProviderWithClerk>
//   );
// }
