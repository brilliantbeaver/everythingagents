import { Breadcrumbs } from "@/components/site/breadcrumbs";

export const metadata = { title: "Glossary" };

export default function Glossary() {
  return (
    <div className="py-8 sm:py-10 max-w-prose">
      <Breadcrumbs crumbs={[{ href: "/", label: "Home" }, { label: "Glossary" }]} />
      <h1 className="mt-3 font-serif text-2xl leading-tight tracking-tight sm:text-3xl">
        Glossary
      </h1>
      <p className="ui-sans mt-3 text-sm text-muted-foreground">
        Terms used across tutorials, with one-line definitions. Populated when
        the MDX pipeline lands.
      </p>
    </div>
  );
}
