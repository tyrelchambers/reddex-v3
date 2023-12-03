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
import { isNotEmpty, useForm } from "@mantine/form";
import React, { FormEvent, useEffect, useRef } from "react";
import { websiteTabItems } from "~/routes";
import { GeneralSettings, MixpanelEvents } from "~/types";
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
import { hasProPlan } from "~/utils";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { toast } from "react-toastify";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize
);

const General = () => {
  const apiContext = api.useContext();
  const { data: user } = api.user.me.useQuery();
  const proPlan = hasProPlan(user?.subscription);

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

  const form = useForm<GeneralSettings>({
    initialValues: {
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

    clearInputErrorOnChange: true,
    validate: {
      subdomain: isNotEmpty(),
      name: isNotEmpty(),
    },
  });
  const subdomainQuery = api.website.checkAvailableSubdomain.useQuery(
    form.values.subdomain as string,
    {
      enabled: !!form.values.subdomain,
    }
  );

  const DISABLE_SUBMIT_BUTTON =
    !proPlan || !form.values.subdomain || !form.values.name;

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({ ...websiteSettings.data });
    }
  }, [websiteSettings.data]);

  const subdomainAvailable =
    !subdomainQuery.data &&
    (!form.values.subdomain ||
      form.values.subdomain !== websiteSettings.data?.subdomain) &&
    form.values.subdomain !== "";

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const thumbnail = thumbnailRef.current?.getFile();
    const banner = bannerRef.current?.getFile();
    const payload: {
      thumbnail?: string;
      banner?: string;
    } = {};
    const { hasErrors } = form.validate();

    if (hasErrors) return;

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
      ...form.values,
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
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading website settings..."
          hasProPlan={proPlan}
        >
          <h1 className="text-2xl text-foreground">General</h1>
          {websiteVisibility.data?.hidden ? (
            <StatusBanner
              title="Enable Website"
              subtitle="Enable your website to be seen by the public."
              action={
                <Button
                  variant="defaultInvert"
                  onClick={showWebsiteHandler}
                  disabled={!proPlan}
                  title={!proPlan ? "Pro plan required" : undefined}
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
              action={<Button onClick={hideWebsiteHandler}>Hide</Button>}
            />
          )}
          <form className="form my-10" onSubmit={submitHandler}>
            <div className="flex w-full flex-col">
              <Label>Subdomain</Label>
              <Input
                placeholder="Your custom subdomain"
                {...form.getInputProps("subdomain")}
              />
              <Link
                href={`https://reddex.app/${
                  websiteSettings.data?.subdomain ?? form.values.subdomain ?? ""
                }`}
              >
                <Badge className="mt-2 w-fit" variant="outline">
                  https://reddex.app/{form.values.subdomain}
                </Badge>
              </Link>
              {form.values.subdomain && subdomainAvailable && (
                <span className="mt-2 flex items-center gap-2 text-sm text-green-500">
                  <FontAwesomeIcon icon={faCheckCircle} /> Subdomain is
                  available
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label>Name of your site</Label>
              <Input
                placeholder="Name of your site"
                required
                {...form.getInputProps("name")}
              />
            </div>
            <div className="flex flex-col">
              <Label>Site description</Label>
              <Textarea
                placeholder="Let people know who you are"
                {...form.getInputProps("description")}
              />
            </div>

            <div className="flex flex-col">
              <p className="label text-foreground">Thumbnail</p>
              <p className="sublabel text-muted-foreground">
                Optimal image size 200 x 200
              </p>
              {!websiteSettings.data?.thumbnail ? (
                <FileUpload
                  uploadRef={thumbnailRef}
                  type="thumbnail"
                  disabled={!proPlan}
                />
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
                    className=" mt-4"
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
                <FileUpload
                  uploadRef={bannerRef}
                  type="banner"
                  disabled={!proPlan}
                />
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
                    className=" mt-4"
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
                The links below will appear as social icons on your site. These
                are not required, and the icons will not appear on your site if
                you leave them blank.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    className="text-foreground/70"
                    icon={faTwitter}
                  />
                  <Input
                    placeholder="@username"
                    {...form.getInputProps("twitter")}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    className="text-foreground/70"
                    icon={faFacebook}
                  />

                  <Input
                    placeholder="Facebook link"
                    {...form.getInputProps("facebook")}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    className="text-foreground/70"
                    icon={faInstagram}
                  />

                  <Input
                    placeholder="@username"
                    {...form.getInputProps("instagram")}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    className="text-foreground/70"
                    icon={faPatreon}
                  />

                  <Input
                    placeholder="Patreon link"
                    {...form.getInputProps("patreon")}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    className="text-foreground/70"
                    icon={faYoutube}
                  />

                  <Input
                    placeholder="Youtube link"
                    {...form.getInputProps("youtube")}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    className="text-foreground/70"
                    icon={faPodcast}
                  />

                  <Input
                    placeholder="Podcast link"
                    {...form.getInputProps("podcast")}
                  />
                </div>
              </div>
            </section>
            <Separator className="my-4" />

            <Button type="submit" disabled={DISABLE_SUBMIT_BUTTON}>
              Save changes
            </Button>
          </form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default General;
