import {
  faFacebook,
  faInstagram,
  faPatreon,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import { websiteTabItems } from "~/routes";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FileUpload from "~/components/FileUpload";
import StatusBanner from "~/components/StatusBanner";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { Button } from "~/components/ui/button";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { toast } from "react-toastify";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { websiteGeneralSchema } from "~/server/schemas";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize,
);

const General = () => {
  const apiContext = api.useUtils();
  const { data: user } = api.user.me.useQuery();

  const websiteSave = api.website.saveGeneral.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
      toast.success("General settings saved");
    },
  });
  const hideWebsite = api.website.setVisibility.useMutation({
    onSuccess: () => {
      apiContext.website.visibility.invalidate();
    },
  });

  const removeImage = api.website.removeImage.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
    },
  });
  const websiteSettings = api.website.settings.useQuery();
  const websiteVisibility = api.website.visibility.useQuery();
  const thumbnailRef = useRef<FilePond | null>(null);
  const bannerRef = useRef<FilePond | null>(null);

  const form = useForm<z.infer<typeof websiteGeneralSchema>>({
    resolver: zodResolver(websiteGeneralSchema),
    defaultValues: {
      subdomain: "",
      name: "",
      description: "",
      twitter: "",
      facebook: "",
      instagram: "",
      patreon: "",
      podcast: "",
      youtube: "",
    },
  });
  const formValues = form.getValues();
  const subdomainFormWatch = form.watch("subdomain");

  const subdomainQuery = api.website.checkAvailableSubdomain.useQuery(
    formValues.subdomain || "",
    {
      enabled: !!formValues.subdomain,
    },
  );

  const DISABLE_SUBMIT_BUTTON = !formValues.subdomain || !formValues.name;

  useEffect(() => {
    if (websiteSettings.data) {
      form.reset({ ...websiteSettings.data });
    }
  }, [websiteSettings.data]);

  const subdomainAvailable =
    !subdomainQuery.data &&
    (!subdomainFormWatch ||
      subdomainFormWatch !== websiteSettings.data?.subdomain) &&
    subdomainFormWatch !== "";

  const submitHandler = async (data: z.infer<typeof websiteGeneralSchema>) => {
    const thumbnail = thumbnailRef.current?.getFile();
    const banner = bannerRef.current?.getFile();
    const payload: {
      thumbnail?: string;
      banner?: string;
    } = {};

    if (thumbnail) {
      trackUiEvent(MixpanelEvents.PROCESS_THUMBNAIL);
      const url = await thumbnailRef.current?.processFile();
      if (url?.serverId) {
        payload["thumbnail"] = url.serverId;
      }
    }

    if (banner) {
      trackUiEvent(MixpanelEvents.PROCESS_BANNER);
      const url = await bannerRef.current?.processFile();
      if (url?.serverId) {
        payload["banner"] = url.serverId;
      }
    }

    trackUiEvent(MixpanelEvents.SAVE_WEBSITE_SETTINGS, {
      userId: user?.id,
    });
    websiteSave.mutate({
      ...data,
      ...payload,
    });
  };

  // handler to hide the website from public
  const hideWebsiteHandler = () => {
    trackUiEvent(MixpanelEvents.HIDE_WEBSITE);
    hideWebsite.mutate(true);
  };

  const showWebsiteHandler = () => {
    trackUiEvent(MixpanelEvents.SHOW_WEBSITE);
    hideWebsite.mutate(false);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <main className="my-6 flex max-w-screen-2xl gap-10">
        <BodyWithLoader
          isLoading={websiteSettings.isPending}
          loadingMessage="Loading website settings..."
        >
          <h1 className="text-2xl text-foreground">General</h1>
          {websiteVisibility.data?.hidden ? (
            <StatusBanner
              title="Enable Website"
              subtitle="Enable your website to be seen by the public."
              action={
                <Button variant="defaultInvert" onClick={showWebsiteHandler}>
                  Make website public{" "}
                </Button>
              }
            />
          ) : (
            <StatusBanner
              type="secondary"
              title="Hide Website"
              subtitle="Hide your website so others can't see it."
              action={<Button onClick={hideWebsiteHandler}>Hide</Button>}
            />
          )}
          <Form {...form}>
            <form
              className="form my-10"
              onSubmit={form.handleSubmit(submitHandler)}
            >
              <div className="flex w-full flex-col">
                <FormField
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdomain</FormLabel>
                      <Input placeholder="Your custom subdomain" {...field} />
                    </FormItem>
                  )}
                />
                <Link
                  href={`https://reddex.app/${
                    websiteSettings.data?.subdomain ?? subdomainFormWatch ?? ""
                  }`}
                >
                  <Badge className="mt-2 w-fit" variant="outline">
                    https://reddex.app/w/{subdomainFormWatch}
                  </Badge>
                </Link>
                {subdomainFormWatch && subdomainAvailable && (
                  <span className="mt-2 flex items-center gap-2 text-sm text-green-500">
                    <FontAwesomeIcon icon={faCheckCircle} /> Subdomain is
                    available
                  </span>
                )}
              </div>

              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of your site</FormLabel>
                    <Input
                      placeholder="Name of your site"
                      required
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site description</FormLabel>
                    <Textarea
                      placeholder="Let people know who you are"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <div className="flex flex-col">
                <p className="label text-foreground">Thumbnail</p>
                <p className="sublabel text-muted-foreground">
                  Optimal image size 200 x 200
                </p>
                {!websiteSettings.data?.thumbnail ? (
                  <FileUpload uploadRef={thumbnailRef} type="thumbnail" />
                ) : (
                  <div className="flex flex-col">
                    <div className="h-[200px] w-[200px] overflow-hidden rounded-xl">
                      <Image
                        src={websiteSettings.data.thumbnail}
                        alt=""
                        width={200}
                        height={200}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() =>
                        websiteSettings.data?.thumbnail &&
                        removeImage.mutate({
                          type: "thumbnail",
                          url: websiteSettings.data?.thumbnail,
                        })
                      }
                    >
                      Remove thumbnail
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="label text-foreground">Cover image</p>
                <p className="sublabel text-muted-foreground">
                  Optimal image size 1500 x 500
                </p>
                {!websiteSettings.data?.banner ? (
                  <FileUpload uploadRef={bannerRef} type="banner" />
                ) : (
                  <div className="flex flex-col">
                    <div className="overflow-hidden rounded-xl">
                      <Image
                        src={websiteSettings.data.banner}
                        alt=""
                        width={672}
                        height={200}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() =>
                        websiteSettings.data?.banner &&
                        removeImage.mutate({
                          type: "banner",
                          url: websiteSettings.data?.banner,
                        })
                      }
                    >
                      Remove banner
                    </Button>
                  </div>
                )}
              </div>
              <Separator className="my-4" />

              <section className="flex flex-col">
                <h2 className="text-xl text-foreground">Social media</h2>
                <p className="font-thin text-foreground/70">
                  The links below will appear as social icons on your site.
                  These are not required, and the icons will not appear on your
                  site if you leave them blank.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <FormField
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            className="text-foreground/70"
                            icon={faTwitter}
                          />
                          <Input placeholder="@username" {...field} />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            className="text-foreground/70"
                            icon={faFacebook}
                          />

                          <Input placeholder="Facebook link" {...field} />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            className="text-foreground/70"
                            icon={faInstagram}
                          />

                          <Input placeholder="@username" {...field} />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="patreon"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            className="text-foreground/70"
                            icon={faPatreon}
                          />

                          <Input placeholder="Patreon link" {...field} />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            className="text-foreground/70"
                            icon={faYoutube}
                          />

                          <Input placeholder="Youtube link" {...field} />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="podcast"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            className="text-foreground/70"
                            icon={faPodcast}
                          />

                          <Input placeholder="Podcast link" {...field} />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </section>
              <Separator className="my-4" />

              <Button type="submit" disabled={DISABLE_SUBMIT_BUTTON}>
                Save changes
              </Button>
            </form>
          </Form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default General;
