import { NextRequest, NextResponse } from "next/server";
import { isUserAdmin } from "../isUserAdmin";
import { getInfo } from "../../utils/common";


export async function GET(request: NextRequest) {

    const { isUserAdmin } = await getInfo(request);

    // console.log('isUserAdmin in checkadmin is: ', isUserAdmin)

    return Response.json({ status: 200, success: true, data: isUserAdmin })

}