import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { signinSchema } from "./formSchemas"
import yup from 'yup'
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { LabelSeparator } from "~/components/ui/separator"
import SocialAuth from "./SocialAuth"
import { Eye, EyeOff, Facebook, Github } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "~/components/ui/checkbox"
import Routes from "~/src/_routes"
import { Fetcher, Link, useFetcher, useSubmit } from "@remix-run/react"
import type { FetcherWithComponents } from "@remix-run/react";


type SignupRenterFormData = yup.InferType<typeof signinSchema>;

export default function SignupForm ({fetcher}: {fetcher: FetcherWithComponents<any>}) {

    const [viewPass, setViewPass] = useState(false)
    const form = useForm<SignupRenterFormData>({
      resolver: yupResolver(signinSchema),
      defaultValues: {
        username: '',
        password: '',
      },
    });
    const isSubmitting = fetcher.state === 'submitting'
  
  
    const onSubmit = async (data: SignupRenterFormData) => {
      fetcher.submit(data, {method: 'post'})
    };

    return (
        <div className=" w-full">
            <Form {...form}>
                <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Email / Username</FormLabel>
                            <FormControl>
                                <Input type='text' placeholder="my@email.com / my-username" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="w-full relative items-center flex">
                              <Input type= {viewPass ? 'text' : 'password'} placeholder="Password" {...field} />
                              <div className="absolute right-2 cursor-pointer" onClick={() => setViewPass(prev => !prev)}>{ viewPass ? <Eye className="w-4" /> : <EyeOff className="w-4" /> }</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full py-2 items-center flex justify-between gap-1 ">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember-me" className='w-6 h-6' />
                          <label
                            htmlFor="remember-me"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Remeber me 
                          </label>
                        </div>
                        <Link to={Routes.resetPassword} className="text-primary text-xs font-medium hover:underline">Forgot Password?</Link>
                    </div>

                    <Button loading={isSubmitting} className="text-xs h-11 mt-4 rounded-lg">
                        Continue
                    </Button>
                </form>
            </Form>

            <LabelSeparator label='or' className='text-xs my-5' />
            <div className="grid grid-cols-2 gap-3">
              <SocialAuth
                type="google" 
                label="google" 
                icon={
                      <img src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' alt='google-auth' className=" w-8 h-auto flex" />
                  }
                provider="google"
                />

              <SocialAuth 
                type="github"
                label="github" 
                icon={<Github className="" />}
                provider="github"
                />
            </div>

            <p className="text-[10.5px] text-center w-full mt-8 leading-loose">
              By continuing, you have read and agree to our <br /> <Link to='#' className="text-primary">Terms and Conditions.</Link>
            </p>
        </div>
    )
}