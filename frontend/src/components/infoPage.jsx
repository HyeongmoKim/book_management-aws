// components/InfoPage.jsx
import React from "react";
import InfoTopBar from "./InfoTopbar";
import InfoDetail from "./InfoDetail";
import Box from "@mui/material/Box";

export default function InfoPage() {
    return (
        <Box sx={{ backgroundColor: "#F3FDE9", minHeight: "100vh" }}>
            {/* 상단바 */}
            <InfoTopBar />

            {/* 본문 영역: AppBar 높이만큼 패딩 */}
            <Box sx={{ pt: "90px" }}>  {/* AppBar 높이 90px 기준 */}
                <InfoDetail />
            </Box>
        </Box>
    );
}