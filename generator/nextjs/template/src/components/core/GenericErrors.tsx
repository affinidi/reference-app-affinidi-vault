import { Session } from "next-auth";

const GenericError: React.FC<{
  featureAvailable: boolean;
  session?: Session | null;
}> = ({ featureAvailable, session }) => {
  if (!featureAvailable) {
    return (
      <div>
        Feature not available. Please set your Personal Access Token in your
        environment secrets.
      </div>
    );
  }

  if (session === null || session?.userId === undefined) {
    return <div>You must be logged in to use Affinidi services</div>;
  }
};

export default GenericError;
