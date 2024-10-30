import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { invitationCheck } from "@/service/common";
import Toast from "@/app/components/base/toast";
import useRefreshToken from "@/hooks/use-refresh-token";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { ThemesPanelBackgroundImage } from "../components/background/themesPanelBackgroundImage";
import Loading from "../components/base/loading";
import classNames from "@/utils/classnames";

const NormalForm = () => {
  const { getNewAccessToken } = useRefreshToken();
  const router = useRouter();
  const searchParams = useSearchParams();
  const consoleToken = decodeURIComponent(
    searchParams.get("access_token") || ""
  );
  const refreshToken = decodeURIComponent(
    searchParams.get("refresh_token") || ""
  );
  const message = decodeURIComponent(searchParams.get("message") || "");
  const invite_token = decodeURIComponent(
    searchParams.get("invite_token") || ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [workspaceName, setWorkSpaceName] = useState("");
  console.log(workspaceName);
  const isInviteLink = Boolean(invite_token && invite_token !== "null");

  const init = useCallback(async () => {
    try {
      if (consoleToken && refreshToken) {
        localStorage.setItem("console_token", consoleToken);
        localStorage.setItem("refresh_token", refreshToken);
        getNewAccessToken();
        router.replace("/apps");
        return;
      }

      if (message) {
        Toast.notify({
          type: "error",
          message,
        });
      }
      if (isInviteLink) {
        const checkRes = await invitationCheck({
          url: "/activate/check",
          params: {
            token: invite_token,
          },
        });
        setWorkSpaceName(checkRes?.data?.workspace_name || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    consoleToken,
    refreshToken,
    message,
    router,
    invite_token,
    isInviteLink,
    getNewAccessToken,
  ]);
  useEffect(() => {
    init();
  }, [init]);
  if (isLoading || consoleToken) {
    return (
      <div
        className={classNames(
          "flex flex-col items-center w-full grow justify-center",
          "px-6",
          "md:px-[108px]"
        )}
      >
        <Loading type="area" />
      </div>
    );
  }

  return (
    <Flex direction="column">
      <Flex
        direction="column"
        position="relative"
        mx={{ initial: "-5", xs: "-6", sm: "0" }}
        px={{ initial: "6", sm: "8" }}
        py={{ initial: "6", sm: "7" }}
      >
        <Flex
          align="center"
          justify="center"
          position="absolute"
          inset="0"
          overflow="hidden"
          style={{ background: "var(--gray-2)" }}
        >
          <ThemesPanelBackgroundImage
            id="1"
            style={{ width: "240%", marginLeft: "70%" }}
          />
        </Flex>

        <Box position="relative">
          <Heading align="center" as="h3" size="6" mb="4">
            Sign up
          </Heading>

          <Box maxWidth="400px" mx="auto">
            <Card size="4">
              <Flex direction="column" mb="5">
                <Flex>
                  <Text
                    htmlFor="example-name"
                    as="label"
                    size="2"
                    weight="medium"
                    mb="1"
                    trim="start"
                  >
                    Full name
                  </Text>
                </Flex>
                <TextField.Root
                  id="example-name"
                  placeholder="Enter your name"
                />
              </Flex>

              <Flex direction="column" mb="5">
                <Flex>
                  <Text
                    htmlFor="example-email"
                    as="label"
                    size="2"
                    weight="medium"
                    mb="1"
                  >
                    Email
                  </Text>
                </Flex>
                <TextField.Root
                  id="example-email"
                  placeholder="Enter your email address"
                />
              </Flex>

              <Flex direction="column" mb="5">
                <Flex>
                  <Text
                    htmlFor="example-password"
                    as="label"
                    size="2"
                    weight="medium"
                    mb="1"
                  >
                    Password
                  </Text>
                </Flex>
                <TextField.Root
                  id="example-password"
                  placeholder="Enter your password"
                />
              </Flex>

              <Grid
                mt="5"
                gap="4"
                style={{ "--cursor-button": "pointer" } as React.CSSProperties}
              >
                <Button>Create account</Button>
              </Grid>
            </Card>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default NormalForm;
