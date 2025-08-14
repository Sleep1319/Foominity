import React, { useState, lazy, Suspense, useMemo, useEffect } from "react";
import { Box, Text, Tabs, TabList, Tab, Flex, Spinner } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const AdminReportList = lazy(() => import("../../components/adminpageComponents/AdminPageList.jsx"));
const AdminMagazine = lazy(() => import("../../components/adminpageComponents/AdminMagazine.jsx"));

export default function AdminPage() {
  const location = useLocation();

  const TABS = useMemo(
    () => [
      { label: "신고·문의", Comp: AdminReportList }, // index 0
      { label: "매거진", Comp: AdminMagazine }, // index 1
      { label: "기타 관리" }, // index 2
    ],
    []
  );

  // 쿼리 ?tab= 값 -> 인덱스 매핑
  const initialTabIndex = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const tab = (params.get("tab") || "").toLowerCase();
    if (tab === "magazine") return 1;
    if (tab === "report") return 0;
    if (tab === "other") return 2;
    return 0;
  }, [location.search]);

  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [visited, setVisited] = useState(() => TABS.map((_, i) => i === initialTabIndex));

  // 쿼리가 바뀌면 탭 업데이트
  useEffect(() => {
    setTabIndex(initialTabIndex);
    setVisited((prev) => {
      const next = [...prev];
      next[initialTabIndex] = true;
      return next;
    });
  }, [initialTabIndex]);

  const onChangeTab = (idx) => {
    setVisited((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    setTabIndex(idx);
  };

  return (
    <Box p={6} mt="100px">
      <Text fontSize="3xl" fontWeight="extrabold" textAlign="center">
        Admin Page
      </Text>

      <Tabs variant="unstyled" index={tabIndex} onChange={onChangeTab} mt={2}>
        <TabList justifyContent="center" gap={2}>
          {TABS.map(({ label }) => (
            <Tab
              key={label}
              _selected={{ color: "black", fontWeight: "bold", borderBottom: "2px solid black" }}
              fontWeight="normal"
              color="gray.700"
              px={4}
              py={2}
            >
              {label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {/* 슬라이드 영역 */}
      <Box position="relative" overflow="hidden" mt={3}>
        <Box
          display="flex"
          width={`${TABS.length * 100}%`}
          transform={`translateX(-${tabIndex * (100 / TABS.length)}%)`}
          transition="transform 0.28s ease-out"
        >
          {TABS.map(({ Comp }, i) => (
            <Box key={i} flex="0 0 calc(100% / var(--tabs))" px={0} style={{ "--tabs": TABS.length }}>
              {Comp && visited[i] ? (
                <Suspense
                  fallback={
                    <Flex justify="center" mt={8}>
                      <Spinner size="lg" />
                    </Flex>
                  }
                >
                  <Comp />
                </Suspense>
              ) : (
                <Box minH="280px" />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
