import {
  faFacebook,
  faInstagram,
  faPatreon,
  faTiktok,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-regular-svg-icons";
import { faExternalLink, faHashtag } from "@fortawesome/pro-solid-svg-icons";
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
import { Button, buttonVariants } from "~/components/ui/button";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { websiteGeneralSchema } from "~/server/schemas";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { toast } from "sonner";
import SubdomainField from "~/components/dashboard/website/SubdomainField";
import AddCustomDomainModal from "~/components/modals/AddCustomDomainModal";
import Ping from "~/components/dashboard/website/Ping";
import DashboardSection from "~/layouts/DashboardSection";
import ThumbnailUploader from "~/components/ThumbnailUploader";
import BannerUploader from "~/components/BannerUploader";
import { Switch } from "~/components/ui/switch";

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
  const deleteCustomDomain = api.website.removeCustomDomain.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
      toast.success("Domain removed");
    },
    onError: () => {
      toast.error("Failed to remove domain");
    },
  });

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
      tiktok: "",
      ohcleo: "",
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

  const deleteCustomDomainHandler = () => {
    if (
      !websiteSettings.data?.customDomain ||
      !websiteSettings.data?.customDomain?.id ||
      !websiteSettings.data?.customDomain?.domain
    )
      return;

    deleteCustomDomain.mutate({
      id: websiteSettings.data?.customDomain?.id,
      domainName: websiteSettings.data?.customDomain?.domain,
      websiteId: websiteSettings.data?.id,
    });
  };

  const updateCollabs = (val: boolean) => {
    if (websiteSettings.data) {
      websiteSave.mutate({
        ...websiteSettings.data,
        openForCollabs: val,
      });
    }
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <BodyWithLoader
        isLoading={websiteSettings.isPending}
        loadingMessage="Loading website settings..."
      >
        <h1 className="text-2xl font-bold text-foreground">General</h1>
        {websiteVisibility.data?.hidden ? (
          <StatusBanner
            title="Enable Website"
            subtitle="Enable your website to be seen by the public."
            action={
              <Button
                variant="defaultInvert"
                className="w-fit"
                onClick={showWebsiteHandler}
              >
                Make website public{" "}
              </Button>
            }
          />
        ) : (
          <StatusBanner
            type="secondary"
            title="Hide Website"
            subtitle="Hide your website so others can't see it."
            action={
              <Button onClick={hideWebsiteHandler} className="w-fit">
                Hide
              </Button>
            }
          />
        )}
        <Form {...form}>
          <form
            className="form my-10"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <DashboardSection
              title="Domain management"
              subtitle="By default, your site will be hosted at: [subdomain].reddex.app"
              background={false}
            >
              <div className="overflow-hidden rounded-xl bg-card">
                {websiteSettings.data?.customDomain ? (
                  <div className="rounded-tl-md rounded-tr-md bg-linear-to-tl from-gray-400 to-gray-200 p-4 dark:from-zinc-800 dark:to-zinc-600">
                    <p className="font-semibold text-foreground">
                      Custom domain
                    </p>
                    <p className="mb-4 text-sm text-foreground/70">
                      Add your custom domain below. After that, make sure to
                      configure your DNS records. Want some{" "}
                      <a
                        href="https://reddex.mintlify.app/"
                        className="text-link underline"
                      >
                        help?
                      </a>
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="flex w-full rounded-md bg-background/50 p-2 px-2 text-foreground backdrop-blur-lg md:px-6">
                        {websiteSettings.data.customDomain.domain}
                      </div>
                      <a
                        href={`https://${websiteSettings.data.customDomain.domain}`}
                        target="_blank"
                        className={buttonVariants({ variant: "secondary" })}
                      >
                        <FontAwesomeIcon
                          icon={faExternalLink}
                          className="mr-2 text-sm"
                        />
                        <p>Visit</p>
                      </a>
                    </div>
                  </div>
                ) : (
                  <SubdomainField
                    subdomain={subdomainFormWatch ?? ""}
                    subdomainAvailable={subdomainAvailable}
                  />
                )}

                <footer className="bg-card p-4">
                  {websiteSettings.data?.customDomain ? (
                    <div className="flex flex-col items-center justify-between gap-4 *:w-full md:flex-row md:*:w-auto">
                      <Button
                        variant="destructive"
                        onClick={deleteCustomDomainHandler}
                      >
                        Remove custom domain
                      </Button>
                      <Ping domain={websiteSettings.data.customDomain.domain} />
                    </div>
                  ) : (
                    <AddCustomDomainModal />
                  )}
                </footer>
              </div>
            </DashboardSection>

            <DashboardSection
              title="General details"
              subtitle="General details about your website."
              background
            >
              <div className="flex flex-col gap-10">
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
                        rows={10}
                        {...field}
                      />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
                  <ThumbnailUploader
                    thumbnail={websiteSettings.data?.thumbnail}
                    thumbnailRef={thumbnailRef}
                    removeImage={() =>
                      websiteSettings.data?.thumbnail &&
                      removeImage.mutate({
                        type: "thumbnail",
                        url: websiteSettings.data?.thumbnail,
                      })
                    }
                  />

                  <BannerUploader
                    image={websiteSettings.data?.banner}
                    imageRef={bannerRef}
                    removeImage={() =>
                      websiteSettings.data?.banner &&
                      removeImage.mutate({
                        type: "banner",
                        url: websiteSettings.data?.banner,
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex w-full flex-col">
                    <p className="text-sm font-medium">Open for collabs</p>
                    <p className="text-sm text-muted-foreground">
                      Show a badge on your website indicating you&apos;re open
                      for collabs with other narrators.
                    </p>
                  </div>
                  <Switch
                    defaultChecked={websiteSettings.data?.openForCollabs}
                    onCheckedChange={updateCollabs}
                  />
                </div>
              </div>
            </DashboardSection>
            <Separator className="my-4" />

            <DashboardSection
              title="Social media"
              subtitle=" The links below will appear as social icons on your site.
                  These are not required, and the icons will not appear on your
                  site if you leave them blank."
              background
            >
              <FormField
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FontAwesomeIcon
                        className="text-foreground/70"
                        icon={faXTwitter}
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

              <FormField
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FontAwesomeIcon
                        className="text-foreground/70"
                        icon={faTiktok}
                      />

                      <Input placeholder="@username" {...field} />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="ohcleo"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FontAwesomeIcon
                        className="text-foreground/70"
                        icon={faHashtag}
                      />

                      <Input placeholder="OhCleo link" {...field} />
                    </div>
                  </FormItem>
                )}
              />
            </DashboardSection>
            <Separator className="my-4" />

            <Button
              type="submit"
              className="w-fit"
              disabled={DISABLE_SUBMIT_BUTTON}
            >
              Save changes
            </Button>
          </form>
        </Form>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default General;
