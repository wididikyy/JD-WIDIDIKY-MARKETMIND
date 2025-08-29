// import Image from "next/image";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Check } from "lucide-react";
import SearchInput from "@/components/search-input";

export default function Home() {
  return (
    <div className="flex-1">
      <div className="w-full py-12 overflow-hidden">
        <div className="container px-4 md:px-6 relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div
            className="pt-5 text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
              Launching Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              AI-infused CRM with
              <br className="hidden md:block" /> AI agents built for you
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              The intelligent CRM that automates your work with a team of AI agents.
            </p>

            <SearchInput />
          </div>
          {/* <div
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
              <Image
                src="https://cdn.dribbble.com/userupload/12302729/file/original-fa372845e394ee85bebe0389b9d86871.png?resize=1504x1128&vertical=center"
                width={1280}
                height={720}
                alt="SaaSify dashboard"
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
            <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
