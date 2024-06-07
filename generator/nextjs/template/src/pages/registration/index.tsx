import {
  Alert,
  Grid,
  Snackbar,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import signInImage from "public/images/sign-in.png";
import { FC, useEffect, useState } from "react";
import Box from "src/components/Box/Box";
import QrCodeGenerator from "src/components/QrCode/QrCodeGenerator";
import { vaultUrl } from "src/lib/variables";
import { pxToRem } from "src/styles/px-to-rem";
import { ToastProps } from "src/types/error";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100%;
  padding: ${pxToRem(80)};
`;

const Container = styled(Box)`
  border: solid 1px #e1e2ef;
`;

const Logo = styled(Box)`
  width: ${pxToRem(400)};
`;

const LogInContainer = styled(Box)`
  width: ${pxToRem(507)};
`;

const InnerLogInContainer = styled(Box)`
  width: ${pxToRem(347)};
`;

const Title = styled.div`
  margin-top: ${pxToRem(40)};
  font-size: ${pxToRem(32)};
  font-family: "lora", sans-serif;
  font-weight: 700;

  div {
    line-height: 1;
    color: #ff5722;
  }
`;
const Content = styled.div`
  margin-top: ${pxToRem(24)};
  margin-bottom: ${pxToRem(32)};
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 400;
`;

const ButtonContainer = styled(Box)`
  margin-top: ${pxToRem(48)};
`;

const Button = styled.button<{ variant: "primary" | "secondary" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: ${pxToRem(12)} ${pxToRem(24)};
  color: #ff5722;
  font-family: "lato", sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  img {
    margin-right: ${pxToRem(16)};
  }

  ${({ variant }) =>
    variant === "primary"
      ? `
      background: #1d58fc;
      color:#fff;
      box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);
      margin-top:${pxToRem(44)};
    `
      : `
      background: #ff5722;
      color: #fff;
      box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);
      margin-bottom:${pxToRem(44)};
    `}
  ${({ variant }) =>
    variant === "secondary"
      ? `
        background: #1d58fc;
        color:#fff;
        box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);
        margin-top:${pxToRem(44)};
      `
      : `
        background: #ff5722;
        color: #fff;
        box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);
        margin-bottom:${pxToRem(44)};
      `}
`;
const theme = createTheme({
  typography: {
    fontSize: 28,
  },
});

type handleResponse = {
  credentialOfferUri: string;
  expiresIn: number;
  issuanceId: string;
  txCode: string;
};

type RegistrationProps = {
  email: string | null | undefined;
  name?: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  holderDid: string | null | undefined;
  credentialTypeId?: string;
};

const defaults: RegistrationProps = {
  email: "",
  name: "",
  phoneNumber: "",
  dob: "",
  gender: "",
  address: "",
  postcode: "",
  city: "",
  country: "",
  holderDid: "",
  credentialTypeId: "InsuranceRegistration",
};

const Registration: FC = () => {
  const { push } = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [issuanceResponse, setIssuanceResponse] = useState<handleResponse>();
  const [registration, setRegistration] = useState<RegistrationProps>(defaults);
  const [toast, setToast] = useState<ToastProps | false>();
  //Prefill available data from session, if user is logged-in
  const { data: session } = useSession();
  useEffect(() => {
    console.log("session", session);
    if (!session || !session.user) return;

    setRegistration((state) => ({
      ...state,
      email: session.user?.email,
      holderDid: session.userId,
    }));
  }, [session]);

  const handleClose = () => {
    setIssuanceResponse(undefined);
    setIsButtonDisabled(false);
    setRegistration((state) => ({
      email: session?.user?.email,
      holderDid: session?.userId,
    }));
    push("/registration");
  };

  const handleOpen = () => {
    window.open(
      `${vaultUrl}=${issuanceResponse?.credentialOfferUri}`,
      "_blank"
    );
  };

  const handleRegistration = async () => {
    if (!registration.holderDid || !registration.email) {
      setToast({
        message:
          "Enter Mandatory Details or Please login to prefill the Mandatory Details",
        type: "error",
      });
      return;
    }
    console.log("Start Issuance");
    console.log("registration Details :", registration);
    setIsButtonDisabled(true);
    const apiData = {
      credentialData: {
        email: registration.email,
        name: registration.name,
        phoneNumber: registration.phoneNumber,
        dob: registration.dob,
        gender: registration.gender,
        address: registration.address,
        postcode: registration.postcode,
        city: registration.city,
        country: registration.country,
      },
      credentialTypeId: registration.credentialTypeId,
      holderDid: registration.holderDid,
    };
    console.log("apiData", apiData);
    const response = await fetch(`/api/credentials/issuance-start`, {
      method: "POST",
      body: JSON.stringify(apiData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let dataResponse = await response.json();
    console.log("dataResponse", dataResponse);

    if (typeof dataResponse == "string") {
      dataResponse = JSON.parse(dataResponse);
    }

    if (dataResponse.credentialOfferUri) {
      setIssuanceResponse(dataResponse);
    }
    setToast({
      message: "Insurance Registration Credentails Issued Successfully",
      type: "success",
    });
    console.log("issuanceResponse", issuanceResponse);
  };

  return (
    <ThemeProvider theme={theme}>
      {toast && toast.message && (
        <Snackbar
          open={!!toast.message}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setToast(false)}
          message={"test"}
        >
          <Alert
            onClose={() => setToast(false)}
            severity={toast?.type || "info"}
            variant="filled"
            sx={{ width: "40%" }}
          >
            {toast.message || "test"}
          </Alert>
        </Snackbar>
      )}
      <Wrapper>
        <Container direction="row">
          <Logo direction="row" justifyContent="flex-start" flex={1}>
            <Image
              src={signInImage.src}
              alt="sign in"
              width={777}
              height={487}
              style={{ objectFit: "cover" }}
            />
          </Logo>
          {!issuanceResponse && (
            <LogInContainer
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <InnerLogInContainer style={{ width: "80%" }}>
                <Title>Insurance Registration</Title>
                <Content>Let's move ahead with your personal details</Content>

                <Grid item xs={12}>
                  <TextField
                    label="Holder's DID *"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.holderDid}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Email *"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      readOnly: true,
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Full Name"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Phone Number"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Date of Birth"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.dob}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({ ...p, dob: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Gender"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.gender}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({ ...p, gender: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Address"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({
                        ...p,
                        address: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Post Code"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.postcode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({
                        ...p,
                        postcode: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({ ...p, city: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Country"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    InputLabelProps={{
                      style: { fontSize: "2rem" }, // change the value as needed
                    }}
                    value={registration.country}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRegistration((p) => ({
                        ...p,
                        country: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <ButtonContainer direction="column">
                  <Button
                    variant="secondary"
                    onClick={handleRegistration}
                    disabled={isButtonDisabled}
                  >
                    Submit
                  </Button>
                </ButtonContainer>
              </InnerLogInContainer>
            </LogInContainer>
          )}

          {issuanceResponse && (
            <LogInContainer
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <InnerLogInContainer style={{ width: "80%" }}>
                <Title>Registration Credential Offer</Title>
                <Content>Your Registration Credentials Offer is Ready</Content>
                <Content style={{ margin: "0.5rem 0" }}>
                  <b>
                    ${vaultUrl}={issuanceResponse.credentialOfferUri}
                  </b>
                </Content>
                <Content style={{ margin: "2rem 0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <QrCodeGenerator
                      qrCodeData={`${vaultUrl}=${issuanceResponse?.credentialOfferUri}`}
                    />
                  </div>
                </Content>
                <Content style={{ margin: "0.5rem 0", fontSize: "20px" }}>
                  <b>
                    {" "}
                    {issuanceResponse.txCode &&
                      `Your Transaction Code: ${issuanceResponse.txCode}`}
                  </b>
                </Content>
                <Content
                  style={{ margin: "0.5rem 0", color: "red", fontSize: "20px" }}
                >
                  <b>Offer Timeout in {issuanceResponse.expiresIn} Second</b>
                </Content>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item flex={1}>
                    <ButtonContainer>
                      <Button variant="secondary" onClick={handleOpen}>
                        Accept
                      </Button>
                    </ButtonContainer>
                  </Grid>
                  <Grid item flex={1}>
                    <ButtonContainer>
                      <Button variant="primary" onClick={handleClose}>
                        Deny
                      </Button>
                    </ButtonContainer>
                  </Grid>
                </Grid>
              </InnerLogInContainer>
            </LogInContainer>
          )}
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Registration;
