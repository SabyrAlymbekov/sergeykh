"use client"

import React from 'react';
import {AccountFormComponent} from "@/components/forms/formsComponent/formComponent";
import { FormProvider, useForm } from "react-hook-form";

const Page = () => {
    const methods = useForm();
    return (
        <div className="flex flex-col">

            <FormProvider {...methods}>
                <AccountFormComponent />
            </FormProvider>
        </div>

    );
};

export default Page;
