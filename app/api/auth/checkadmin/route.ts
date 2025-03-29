import { NextRequest, NextResponse } from "next/server";
import { isUserAdmin } from "../isUserAdmin";
import { getInfo } from "@/app/api/utils/common";

// This config makes Next.js understand this is a dynamic route that shouldn't be built statically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const { isUserAdmin } = await getInfo(request);

        // Return the admin status
        return Response.json({
            status: 200,
            success: true,
            data: isUserAdmin
        });
    } catch (error) {
        console.error('Error checking admin status:', error);
        return Response.json({
            status: 500,
            success: false,
            data: false,
            message: 'Failed to check admin status'
        });
    }
}