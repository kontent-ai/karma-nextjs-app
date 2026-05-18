import { Container } from "@/components/Container.tsx";
import { LANGUAGE_LABELS, type SupportedLanguage } from "@/i18n/routing.ts";

type Props = Readonly<{
  locale: SupportedLanguage;
}>;

export const NotTranslated = ({ locale }: Props) => (
  <Container>
    <div className="py-32 flex flex-col items-center text-center gap-2">
      <h2 className="text-heading-2 text-heading-2-color">Not translated yet</h2>
      <p className="text-body-lg text-body-color max-w-xl">
        Sorry, this page hasn't been translated to {LANGUAGE_LABELS[locale]} yet.
      </p>
    </div>
  </Container>
);
