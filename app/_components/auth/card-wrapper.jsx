import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AuthHeader from "./auth-header";
import BackButton from "./back-button";

function CardWrapper({
  label,
  title,
  backButtonHref,
  backButtonLabel,
  children,
}) {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md bg-gray-100">
      <CardHeader>
        <AuthHeader label={label} title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex items-center justify-center">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;
