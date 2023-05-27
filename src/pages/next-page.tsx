import { useReduxStore } from "@/stores/store";
import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Page() {
  const counts = useReduxStore((state) => state.counts);
  return (
    <Box>
      <div>
        <Link href="/">
          <Button>Go Back</Button>
        </Link>
      </div>
      <div>Counts: {counts}</div>
    </Box>
  );
}
