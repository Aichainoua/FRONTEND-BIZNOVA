import { AppHeader, Body, Card, Eyebrow, Screen, Title } from '../../components/kit';

export function ComingSoonScreen({ title, description }: { title: string; description: string }) {
  return (
    <Screen>
      <AppHeader />
      <Eyebrow>Bientôt disponible</Eyebrow>
      <Title>{title}</Title>
      <Card>
        <Body>{description}</Body>
      </Card>
    </Screen>
  );
}
